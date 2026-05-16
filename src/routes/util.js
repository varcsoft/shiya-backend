import express from "express";
import auth from "../middleware/auth.js";
import { verifyPinCodeC } from "../controllers/utilController.js";
import verifySchema from "../config/myzod.js";

const router = express.Router();
import { pinCodeSchema } from "../Models/Validations/UtilSchema.js";

router.post(
  "/pincode/verify",
  verifySchema(pinCodeSchema),
  verifyPinCodeC,
);

export default router;
