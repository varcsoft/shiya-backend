import delhiverySdk from "../sdks/delhivery.js";

const safeString = (value) => (value == null ? "" : String(value)).trim();
const safeArray = (value) => (Array.isArray(value) ? value : []);
const safeNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const checkPincodeServiceability = async (pincode) => {
  const response = await delhiverySdk.getPincodeServiceability({
    filter_codes: pincode,
  });

  const deliveryCodes = safeArray(response?.delivery_codes);
  const postalCodes = deliveryCodes.flatMap((item) => safeArray(item?.postal_code));
  const remarks = postalCodes.map((item) => safeString(item?.remark));
  const embargoed = remarks.some((remark) => remark.toLowerCase() === "embargo");
  const serviceable = postalCodes.length > 0 && !embargoed;

  return {
    pincode: safeString(pincode),
    serviceable,
    embargoed,
    deliveryCodes,
    remarks,
    raw: response,
  };
};

const trackShipments = async ({ waybill, ref_ids } = {}) => {
  const response = await delhiverySdk.trackPackages({ waybill, ref_ids });
  const shipments = safeArray(response?.ShipmentData).map((item) => {
    const shipment = item?.Shipment || {};
    const status = shipment?.Status || {};
    const scans = safeArray(shipment?.Scans).map((scanItem) => scanItem?.ScanDetail || {});

    return {
      waybill: safeString(shipment?.AWB),
      orderId: safeString(shipment?.ReferenceNo),
      orderType: safeString(shipment?.OrderType),
      status: safeString(status?.Status),
      statusCode: safeString(status?.StatusCode),
      statusType: safeString(status?.StatusType),
      statusLocation: safeString(status?.StatusLocation),
      statusDateTime: status?.StatusDateTime || null,
      instructions: safeString(status?.Instructions),
      expectedDeliveryDate: shipment?.ExpectedDeliveryDate || null,
      promisedDeliveryDate: shipment?.PromisedDeliveryDate || null,
      deliveryDate: shipment?.DeliveryDate || null,
      pickupDate: shipment?.PickUpDate || null,
      codAmount: shipment?.CODAmount ?? null,
      invoiceAmount: shipment?.InvoiceAmount ?? null,
      consignee: shipment?.Consignee || null,
      scans,
      raw: shipment,
    };
  });

  return {
    count: shipments.length,
    shipments,
    raw: response,
  };
};

const trackShipmentByWaybill = async (waybill) =>
  trackShipments({
    waybill,
  });

const trackShipmentByReferenceIds = async (ref_ids) =>
  trackShipments({
    ref_ids,
  });

const createShipment = async ({ pickup_location, shipments } = {}) => {
  const response = await delhiverySdk.createShipment({
    pickup_location,
    shipments,
  });

  const packages = safeArray(response?.packages).map((pkg) => ({
    status: safeString(pkg?.status),
    client: safeString(pkg?.client),
    sortCode: safeString(pkg?.sort_code),
    remarks: safeArray(pkg?.remarks),
    waybill: safeString(pkg?.waybill),
    codAmount: pkg?.cod_amount ?? null,
    payment: safeString(pkg?.payment),
    serviceable: Boolean(pkg?.serviceable),
    refnum: safeString(pkg?.refnum),
    raw: pkg,
  }));

  return {
    success: Boolean(response?.success),
    remark: safeString(response?.rmk),
    error: response?.error ?? null,
    packageCount: safeNumber(response?.package_count),
    pickupCount: safeNumber(response?.pickups_count),
    prepaidCount: safeNumber(response?.prepaid_count),
    codCount: safeNumber(response?.cod_count),
    replacementCount: safeNumber(response?.replacement_count),
    cashPickupsCount: safeNumber(response?.cash_pickups_count),
    cashPickups: safeNumber(response?.cash_pickups),
    codAmount: response?.cod_amount ?? null,
    uploadWaybill: safeString(response?.upload_wbn),
    packages,
    failedPackages: packages.filter((pkg) => pkg.status.toLowerCase() !== "success"),
    raw: response,
  };
};

const createPickupRequest = async (payload) => {
  const response = await delhiverySdk.createPickupRequest(payload);

  return {
    pickupId: response?.pickup_id ?? null,
    pickupLocationName: safeString(response?.pickup_location_name),
    clientName: safeString(response?.client_name),
    incomingCenterName: safeString(response?.incoming_center_name),
    pickupDate: safeString(response?.pickup_date),
    pickupTime: safeString(response?.pickup_time),
    expectedPackageCount: safeNumber(response?.expected_package_count),
    raw: response,
  };
};

const cancelShipment = async (waybill) => {
  const response = await delhiverySdk.cancelShipment({
    waybill,
  });

  return {
    success: Boolean(response?.status),
    waybill: safeString(response?.waybill),
    orderId: safeString(response?.order_id),
    remark: safeString(response?.remark),
    error: safeString(response?.error),
    raw: response,
  };
};

export {
  cancelShipment,
  checkPincodeServiceability,
  createPickupRequest,
  createShipment,
  trackShipmentByReferenceIds,
  trackShipmentByWaybill,
  trackShipments,
};
