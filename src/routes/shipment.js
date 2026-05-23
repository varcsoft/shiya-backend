import express from "express";
import auth from "../middleware/auth.js";
import { verifyPinCodeC } from "../controllers/utilController.js";
import {
  cancelShipmentC,
  createShipmentC,
  updateShipmentC,
  createWarehouseC,
} from "../controllers/shipmentController.js";
import verifySchema from "../config/myzod.js";
import { pinCodeSchema } from "../Models/Validations/UtilSchema.js";
import {
  shipmentSchema,
  updateShipmentSchema,
} from "../Models/Validations/ShipmentSchema.js";

const router = express.Router();

router.post(
  "/pincode/verify",
  verifySchema(pinCodeSchema),
  auth.authenticateToken,
  verifyPinCodeC,
);
router.post(
  "/warehouse/create",
  // verifySchema(pinCodeSchema),
  auth.authenticateToken,
  createWarehouseC,
);
router.post(
  "/create",
  verifySchema(shipmentSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  createShipmentC,
);
router.put(
  "/:id",
  verifySchema(updateShipmentSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  updateShipmentC,
);
router.delete(
  "/:id",
  auth.authenticateToken,
  auth.requireAdmin,
  cancelShipmentC,
);

export default router;
