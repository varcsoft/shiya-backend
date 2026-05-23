import response from "../config/response.js";
import delhiverySdk from "../sdks/delhivery.js";
import { getAddressByIdAndUserId } from "../services/addressService.js";
import {
  createShipment,
  getShipmentById,
  updateShipment,
  trackShipmentByWaybill,
  trackShipmentByReferenceIds,
  cancelShipment,
} from "../services/shipmentService.js";

const createShipmentC = async (req, res) => {
  try {
    const waybillNumber = await delhiverySdk.getSingleWaybill();
    console.log(waybillNumber);
    const shipment = await createShipment(req.body);
    return response.sendSuccess(
      res,
      200,
      999,
      "Shipment created successfully",
      shipment,
    );
  } catch (err) {
    console.error(err.response);
    return response.sendError(res, 500, 999, "Unable to create shipment");
  }
};
const updateShipmentC = async (req, res) => {
  try {
    const shipment = await updateShipment(req.body);
    response.sendSuccess(
      res,
      200,
      999,
      "Shipment updated successfully",
      shipment,
    );
  } catch (err) {
    response.sendError(res, 500, 999, "Unable to update shipment");
  }
};
const trackShipmentByWaybillC = async (req, res) => {
  try {
    const shipment = await trackShipmentByWaybill(req.params.waybill);
    response.sendSuccess(
      res,
      200,
      999,
      "Shipment tracked successfully",
      shipment,
    );
  } catch (err) {
    response.sendError(res, 500, 999, "Unable to track shipment by waybill");
  }
};
const cancelShipmentC = async (req, res) => {
  try {
    const shipment = await cancelShipment(req.body);
    response.sendSuccess(
      res,
      200,
      999,
      "Shipment cancelled successfully",
      shipment,
    );
  } catch (err) {
    response.sendError(res, 500, 999, "Unable to cancel shipment");
  }
};
const createWarehouseC = async (req, res) => {
  try {
    const warehouse = await delhiverySdk.createWarehouse(req.body);
    return response.sendSuccess(
      res,
      200,
      999,
      "Warehouse created successfully",
      warehouse,
    );
  } catch (err) {
    console.error(err.response.data);
    return response.sendError(res, 500, 999, "Unable to create warehouse");
  }
};
export {
  createShipmentC,
  updateShipmentC,
  trackShipmentByWaybillC,
  cancelShipmentC,
  createWarehouseC,
};

const a = 10;
const b = 10;
console.log(a ^ b)
if (a ^ b) {
  console.log("a is b");
} else {
  console.log("a is not b");
}
