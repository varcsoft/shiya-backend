import express from "express";
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createProductVariantC,
  deleteVariantC,
  getAllVariantsByProductIdC,
  getAllVariantsC,
  getVariantByIdC,
  updateVariantC,
} from "../controllers/variantController.js";
import {
  variantStandaloneSchema,
  updateVariantStandaloneSchema,
} from "../Models/Validations/ProductSchema.js";

const router = express.Router();

router.post(
  "/",
  verifySchema(variantStandaloneSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  createProductVariantC
);

router.put(
  "/:id",
  verifySchema(updateVariantStandaloneSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  updateVariantC
);

router.get("/", auth.authenticateToken, getAllVariantsC);

router.get("/product/:id", auth.authenticateToken, getAllVariantsByProductIdC);

router.get("/:id", auth.authenticateToken, getVariantByIdC);

router.delete(
  "/:id",
  auth.authenticateToken,
  auth.requireAdmin,
  deleteVariantC
);

export default router;
