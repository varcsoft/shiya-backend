import axios from "axios";
import { env } from "../config/env.js";
import logger from "../utils/logger.js";
// Test Environment URL
// https://staging-express.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=110053&o_pin=110042&cgm=10&pt=Pre-paid
// Production Environment URL
// https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=110053&o_pin=110042&cgm=10&pt=Pre-paid

const DELHIVERY_PATHS = {
  createWarehouse: "/api/backend/clientwarehouse/create/",
  pincodeServiceability: "/c/api/pin-codes/json/",
  tracking: "/api/v1/packages/json/",
  shipmentCreation: "/api/cmu/create.json",
  pickupRequest: "/fm/request/new/",
  cancelShipment: "/api/p/edit",
  waybillFetch: "waybill/api/bulk/json/?count=1",
  calculateCost:
    "/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=110053&o_pin=110042&cgm=10&pt=Pre-paid/",
};
const delhiveryApi = axios.create({
  baseURL: env.DELHIVERY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${env.DELHIVERY_TOKEN}`,
  },
});
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRY_ATTEMPTS = 2;
const RETRYABLE_STATUS_CODES = new Set([403, 408, 429, 500, 502, 503, 504]);
const DISALLOWED_SHIPMENT_CHARACTERS = /[&%#;\\]/;

const safeString = (value) => (value == null ? "" : String(value)).trim();

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

const isValidPincode = (value) => /^[1-9][0-9]{5}$/.test(safeString(value));

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
  async getPincodeServiceability(filterCode) {
    return delhiveryApi.get(DELHIVERY_PATHS.pincodeServiceability, {
      params: { filter_codes: safeString(filterCode) },
    });
  }

  async getSingleWaybill() {
    return delhiveryApi.get(DELHIVERY_PATHS.waybillFetch);
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

    return delhiveryApi.get(DELHIVERY_PATHS.tracking, {
      params: compactObject({
        waybill: waybillList.length ? waybillList.join(",") : undefined,
        ref_ids: referenceIds.length ? referenceIds.join(",") : undefined,
      }),
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

    return delhiveryApi.post(DELHIVERY_PATHS.pickupRequest, {
      data: compactObject({
        pickup_time: safeString(payload.pickup_time),
        pickup_date: safeString(payload.pickup_date),
        pickup_location: safeString(payload.pickup_location),
        expected_package_count: Number(payload.expected_package_count),
      }),
    });
  }
  async createWarehouse(payload = {}) {
    return delhiveryApi.post(DELHIVERY_PATHS.createWarehouse, {
      data: compactObject(payload),
    });
  }
// {
//   "data": {
//     "active": true,
//     "address": "BDD CHAWL NO: -84, R00M NO: -3, DN WAKRIKAR MARG",
//     "business_days": [
//       "MON",
//       "TUE",
//       "WED",
//       "THU",
//       "FRI",
//       "SAT"
//     ],
//     "business_hours": {
//       "FRI": {
//         "close_time": "18:30",
//         "start_time": "09:30"
//       },
//       "MON": {
//         "close_time": "18:30",
//         "start_time": "09:30"
//       },
//       "SAT": {
//         "close_time": "18:30",
//         "start_time": "09:30"
//       },
//       "THU": {
//         "close_time": "18:30",
//         "start_time": "09:30"
//       },
//       "TUE": {
//         "close_time": "18:30",
//         "start_time": "09:30"
//       },
//       "WED": {
//         "close_time": "18:30",
//         "start_time": "09:30"
//       }
//     },
//     "client": "946d93-VARCSOFT-do-cdp",
//     "largest_vehicle_constraint": null,
//     "message": "A new client warehouse has been created in HQ(Delhivery).",
//     "name": "BDD CHAWL NO: -84, R00M NO: -3, DN WAKRIKAR MARG",
//     "phone": "7738508405",
//     "pincode": 400018,
//     "type_of_clientwarehouse": null
//   },
//   "error": "",
//   "success": true
// }

// 946d93-VARCSOFT-do-cdp

// 85410910000136
  async cancelShipment({ waybill, cancellation = "true" } = {}) {
    return delhiveryApi.post(DELHIVERY_PATHS.cancelShipment, {
      data: {
        waybill: safeString(waybill),
        cancellation: "true",
      },
    });
  }
}

const delhiverySdk = new DelhiverySDK();

export { DelhiveryApiError, DELHIVERY_PATHS, DelhiverySDK };
export default delhiverySdk;
