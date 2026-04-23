import express from "express";
// import authMiddleware from '../middleware/auth.js';
import authController from "../controllers/authController.js";
import verifySchema from "../config/myzod.js";

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  firebaseVerifySchema,
} from "../Models/Validations/AuthSchema.js";

const router = express.Router();

router.post("/register", verifySchema(registerSchema), authController.register);

router.post("/login", verifySchema(loginSchema), authController.login);

router.post(
  "/firebase",
  verifySchema(firebaseVerifySchema),
  authController.firebaseAuth
);

router.post(
  "/forgot-password",
  verifySchema(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  verifySchema(resetPasswordSchema),
  authController.resetPassword
);

export default router;
