import axios from "axios";
import { env } from "../config/env.js";
import logger from "../utils/logger.js";

const DELHIVERY_PATHS = {
  pincodeServiceability: "/c/api/pin-codes/json/",
  tracking: "/api/v1/packages/json/",
  shipmentCreation: "/api/cmu/create.json",
  pickupRequest: "/fm/request/new/",
  cancelShipment: "/api/p/edit",
};

const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRY_ATTEMPTS = 2;
const RETRYABLE_STATUS_CODES = new Set([403, 408, 429, 500, 502, 503, 504]);
const DISALLOWED_SHIPMENT_CHARACTERS = /[&%#;\\]/;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const safeString = (value) => (value == null ? "" : String(value)).trim();
const safeNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const compactObject = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => compactObject(item))
      .filter((item) => item !== undefined);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((acc, [key, currentValue]) => {
    const cleaned = compactObject(currentValue);
    if (
      cleaned !== undefined &&
      !(typeof cleaned === "string" && cleaned.trim() === "")
    ) {
      acc[key] = cleaned;
    }
    return acc;
  }, {});
};

const maskToken = (token) => {
  const safeToken = safeString(token);
  if (!safeToken) return "";
  if (safeToken.length <= 8) return `${safeToken}***`;
  return `${safeToken.slice(0, 8)}***`;
};

const isValidPincode = (value) => /^[1-9][0-9]{5}$/.test(safeString(value));

const isProbablyRetryableError = (error) => {
  const statusCode = error?.response?.status;
  const errorCode = safeString(error?.code);

  return (
    RETRYABLE_STATUS_CODES.has(statusCode) ||
    errorCode === "ECONNABORTED" ||
    errorCode === "ETIMEDOUT"
  );
};

class DelhiveryApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "DelhiveryApiError";
    this.details = details;
  }
}

const validateShipment = (shipment = {}) => {
  const requiredFields = [
    "name",
    "order",
    "phone",
    "add",
    "pin",
    "payment_mode",
  ];
  const missingFields = requiredFields.filter((field) => {
    const value = shipment?.[field];
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return safeString(value) === "";
  });

  if (missingFields.length) {
    throw new DelhiveryApiError("Missing required shipment fields", {
      missingFields,
      shipmentOrder: safeString(shipment?.order),
    });
  }

  if (!isValidPincode(shipment.pin)) {
    throw new DelhiveryApiError(
      "Shipment pin must be a valid 6-digit pincode",
      {
        pin: shipment.pin,
        shipmentOrder: safeString(shipment?.order),
      },
    );
  }

  if (safeString(shipment.order).length > 50) {
    throw new DelhiveryApiError(
      "Shipment order field must be 50 characters or fewer",
      {
        shipmentOrder: safeString(shipment.order),
      },
    );
  }

  const stringFieldsToCheck = [
    "name",
    "order",
    "add",
    "city",
    "state",
    "country",
    "products_desc",
    "seller_name",
    "seller_add",
    "seller_inv",
  ];

  for (const field of stringFieldsToCheck) {
    if (DISALLOWED_SHIPMENT_CHARACTERS.test(safeString(shipment[field]))) {
      throw new DelhiveryApiError(
        `Shipment field "${field}" contains unsupported special characters`,
        {
          field,
          shipmentOrder: safeString(shipment.order),
        },
      );
    }
  }
};

const validatePickupRequest = (payload = {}) => {
  const requiredFields = [
    "pickup_time",
    "pickup_date",
    "pickup_location",
    "expected_package_count",
  ];
  const missingFields = requiredFields.filter(
    (field) => safeString(payload?.[field]) === "",
  );

  if (missingFields.length) {
    throw new DelhiveryApiError("Missing required pickup request fields", {
      missingFields,
    });
  }
};

class DelhiverySDK {
  constructor({
    baseURL = env.DELHIVERY_BASE_URL,
    token = env.DELHIVERY_TOKEN,
    timeout = safeNumber(env.DELHIVERY_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  } = {}) {
    this.baseURL = safeString(baseURL);
    this.token = safeString(token);
    this.timeout = timeout;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
    });
  }

  assertConfigured() {
    const missing = [];

    if (!this.baseURL) {
      missing.push("DELHIVERY_BASE_URL");
    }
    if (!this.token) {
      missing.push("DELHIVERY_TOKEN");
    }

    if (missing.length) {
      throw new DelhiveryApiError("Missing Delhivery configuration", {
        missing,
      });
    }
  }

  buildHeaders({
    token = this.token,
    authScheme = "Token",
    contentType = "application/json",
    extraHeaders = {},
  } = {}) {
    const headers = {
      Accept: "application/json",
      ...extraHeaders,
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    if (token) {
      headers.Authorization = `${authScheme} ${token}`;
    }

    return headers;
  }

  normalizeError(error, context = {}) {
    if (error instanceof DelhiveryApiError) {
      return error;
    }

    const statusCode = error?.response?.status;
    const responseData = error?.response?.data;
    const responseText =
      typeof responseData === "string"
        ? responseData
        : responseData?.error ||
          responseData?.Error ||
          responseData?.rmk ||
          responseData?.remark ||
          error?.message ||
          "Delhivery API request failed";

    return new DelhiveryApiError(responseText, {
      statusCode,
      responseData,
      context,
      code: error?.code,
    });
  }

  getBusinessErrorMessage(data) {
    if (!data || typeof data !== "object") {
      return "";
    }

    if (data.Success === false) {
      return safeString(data.Error || data.rmk);
    }

    if (data.success === false) {
      return safeString(data.message || data.rmk || data.error);
    }

    if (data.status === false) {
      return safeString(data.error || data.remark || data.rmk);
    }

    return "";
  }

  async request(
    {
      method,
      path,
      params,
      data,
      headers,
      timeout,
      apiName,
      retryAttempts = MAX_RETRY_ATTEMPTS,
    },
    attempt = 0,
  ) {
    this.assertConfigured();

    const startedAt = Date.now();
    const requestConfig = {
      method,
      url: path,
      params,
      data,
      headers,
      timeout: timeout || this.timeout,
    };

    logger.info("Delhivery API request", {
      api: apiName,
      method,
      path,
      params,
      token: maskToken(this.token),
      attempt: attempt + 1,
    });

    try {
      const response = await this.client(requestConfig);
      const businessError = this.getBusinessErrorMessage(response.data);

      if (businessError) {
        throw new DelhiveryApiError(businessError, {
          statusCode: response.status,
          responseData: response.data,
          apiName,
        });
      }

      logger.info("Delhivery API response", {
        api: apiName,
        statusCode: response.status,
        durationMs: Date.now() - startedAt,
      });

      return response.data;
    } catch (error) {
      const shouldRetry =
        attempt < retryAttempts && isProbablyRetryableError(error);

      logger.warn("Delhivery API error", {
        api: apiName,
        statusCode: error?.response?.status,
        durationMs: Date.now() - startedAt,
        error: error?.message,
        retrying: shouldRetry,
      });

      if (shouldRetry) {
        const retryDelayMs =
          error?.response?.status === 403 ? 30000 : 1000 * (attempt + 1);
        await sleep(retryDelayMs);
        return this.request(
          {
            method,
            path,
            params,
            data,
            headers,
            timeout,
            apiName,
            retryAttempts,
          },
          attempt + 1,
        );
      }

      throw this.normalizeError(error, {
        apiName,
        method,
        path,
        params,
      });
    }
  }

  async getPincodeServiceability(filterCode) {
    if (!isValidPincode(filterCode)) {
      throw new DelhiveryApiError(
        "filterCode must be a valid 6-digit pincode",
        {
          filterCode,
        },
      );
    }

    return this.request({
      method: "GET",
      path: DELHIVERY_PATHS.pincodeServiceability,
      params: { filter_codes: safeString(filterCode) },
      headers: this.buildHeaders(),
      apiName: "pincode_serviceability",
    });
  }

  async trackPackages({ waybill, ref_ids } = {}) {
    const waybillList = Array.isArray(waybill)
      ? waybill.map((item) => safeString(item)).filter(Boolean)
      : safeString(waybill)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const referenceIds = Array.isArray(ref_ids)
      ? ref_ids.map((item) => safeString(item)).filter(Boolean)
      : safeString(ref_ids)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    if (!waybillList.length && !referenceIds.length) {
      throw new DelhiveryApiError(
        "Either waybill or ref_ids must be provided for tracking",
      );
    }

    if (waybillList.length > 50) {
      throw new DelhiveryApiError(
        "Tracking supports up to 50 waybills per request",
        {
          count: waybillList.length,
        },
      );
    }

    return this.request({
      method: "GET",
      path: DELHIVERY_PATHS.tracking,
      params: compactObject({
        waybill: waybillList.length ? waybillList.join(",") : undefined,
        ref_ids: referenceIds.length ? referenceIds.join(",") : undefined,
      }),
      headers: this.buildHeaders(),
      apiName: "tracking",
    });
  }

  async createShipment({ pickup_location, shipments } = {}) {
    const shipmentList = Array.isArray(shipments) ? shipments : [];
    const pickupLocationName = safeString(pickup_location?.name);

    if (!pickupLocationName) {
      throw new DelhiveryApiError("pickup_location.name is required", {
        pickup_location,
      });
    }

    if (!shipmentList.length) {
      throw new DelhiveryApiError("shipments must be a non-empty array");
    }

    shipmentList.forEach((shipment) => validateShipment(shipment));

    const payload = {
      pickup_location: { name: pickupLocationName },
      shipments: shipmentList.map((shipment) => compactObject(shipment)),
    };

    const formBody = new URLSearchParams({
      format: "json",
      data: JSON.stringify(payload),
    }).toString();

    return this.request({
      method: "POST",
      path: DELHIVERY_PATHS.shipmentCreation,
      data: formBody,
      headers: this.buildHeaders({
        contentType: "application/x-www-form-urlencoded",
      }),
      timeout: 15000,
      apiName: "shipment_creation",
    });
  }

  async createPickupRequest(
    payload = {
      pickup_time: "",
      pickup_date: "",
      pickup_location: "",
      expected_package_count: 0,
    },
  ) {
    validatePickupRequest(payload);

    return this.request({
      method: "POST",
      path: DELHIVERY_PATHS.pickupRequest,
      data: compactObject({
        pickup_time: safeString(payload.pickup_time),
        pickup_date: safeString(payload.pickup_date),
        pickup_location: safeString(payload.pickup_location),
        expected_package_count: Number(payload.expected_package_count),
      }),
      headers: this.buildHeaders(),
      apiName: "pickup_request",
    });
  }

  async cancelShipment({ waybill, cancellation = "true" } = {}) {
    if (!safeString(waybill)) {
      throw new DelhiveryApiError("waybill is required to cancel a shipment");
    }

    if (safeString(cancellation) !== "true") {
      throw new DelhiveryApiError(
        'cancellation must be the string literal "true"',
      );
    }

    return this.request({
      method: "POST",
      path: DELHIVERY_PATHS.cancelShipment,
      data: {
        waybill: safeString(waybill),
        cancellation: "true",
      },
      headers: this.buildHeaders(),
      apiName: "cancel_shipment",
    });
  }
}

const delhiverySdk = new DelhiverySDK();

export { DelhiveryApiError, DELHIVERY_PATHS, DelhiverySDK };
export default delhiverySdk;
