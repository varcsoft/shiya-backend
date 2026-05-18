import express from "express";
import authMiddleware from "../middleware/auth.js";
import userController from "../controllers/userController.js";
import verifySchema from "../config/myzod.js";
import {
  addressSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "../Models/Validations/ProfileSchema.js";
import { checkPinCodeServiceAvailable } from "../middleware/pincodeServicable.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  userController.getAllUsersC,
);
router.get(
  "/profile",
  authMiddleware.authenticateToken,
  userController.getProfile,
);
router.get(
  "/address",
  authMiddleware.authenticateToken,
  userController.getAddresses,
);

router.get(
  "/address/:id",
  authMiddleware.authenticateToken,
  userController.getAddressByIdC,
);

router.post(
  "/address",
  verifySchema(addressSchema),
  authMiddleware.authenticateToken,
  checkPinCodeServiceAvailable,
  userController.addAddress,
);

router.put(
  "/address/:id",
  verifySchema(addressSchema),
  authMiddleware.authenticateToken,
  userController.updateAddressByIdC,
);

router.put(
  "/profile",
  verifySchema(updateProfileSchema),
  authMiddleware.authenticateToken,
  userController.updateProfile,
);

router.delete(
  "/address/:id",
  authMiddleware.authenticateToken,
  userController.deleteAddressByIdC,
);

router.get(
  "/orders",
  authMiddleware.authenticateToken,
  userController.getOrders,
);

router.get(
  "/password/check",
  authMiddleware.authenticateToken,
  userController.checkPassword,
);
router.put(
  "/password",
  verifySchema(updatePasswordSchema),
  authMiddleware.authenticateToken,
  userController.updatePassword,
);

router.get(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  userController.getUserC,
);

export default router;
