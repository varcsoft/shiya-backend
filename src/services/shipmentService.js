import axios from "axios";
import delhiverySdk from "../sdks/delhivery.js";

const createShipment = (data) => {
  
};
const getShipmentById = () => {};
const updateShipment = () => {};
const trackShipmentByWaybill = () => {};
const trackShipmentByReferenceIds = () => {};
const cancelShipment = (data) => {
  return delhiverySdk.cancelShipment(data);
};

export {
  createShipment,
  getShipmentById,
  updateShipment,
  trackShipmentByWaybill,
  trackShipmentByReferenceIds,
  cancelShipment,
};
