import express from "express";
import auth from "../middleware/auth.js";
import { verifyPinCodeC } from "../controllers/utilController.js";
import {
  cancelShipmentC,
  createShipmentC,
  updateShipmentC,
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
  "/create",
  verifySchema(shipmentSchema),
  auth.requireAdmin,
  auth.authenticateToken,
  createShipmentC,
);
router.put(
  "/:id",
  verifySchema(updateShipmentSchema),
  auth.requireAdmin,
  auth.authenticateToken,
  updateShipmentC,
);
router.delete(
  "/:id",
  auth.requireAdmin,
  auth.authenticateToken,
  cancelShipmentC,
);

export default router;
