import express from "express";
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createCartC,
  deleteAllCartC,
  deleteCartC,
  getCartsC,
  updateCartC,
} from "../controllers/cartController.js";
import { cartSchema } from "../Models/Validations/CartSchema.js";
import { updateCartSchema } from "../Models/Validations/CartSchema.js";

const router = express.Router();

router.post("/", verifySchema(cartSchema), auth.authenticateToken, createCartC);

router.get("/", auth.authenticateToken, getCartsC);

// router.get("/:id", auth.authenticateToken, getCartsC);

router.put(
  "/:id",
  verifySchema(updateCartSchema),
  auth.authenticateToken,
  updateCartC,
);

router.delete("/:id", auth.authenticateToken, deleteCartC);
router.delete("/", auth.authenticateToken, deleteAllCartC);

export default router;
