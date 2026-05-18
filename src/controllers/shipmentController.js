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
    // const waybillNumber = delhiverySdk.;

    const shipment = await createShipment(req.body);
    response.sendSuccess(
      res,
      200,
      999,
      "Shipment created successfully",
      shipment,
    );
  } catch (err) {
    response.sendError(res, 500, 999, "Unable to create shipment");
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

export {
  createShipmentC,
  updateShipmentC,
  trackShipmentByWaybillC,
  cancelShipmentC,
};
