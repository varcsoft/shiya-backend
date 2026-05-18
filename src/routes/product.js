import express from "express";
// import authMiddleware from '../middleware/auth.js';
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createProductC,
  deleteProductC,
  getAllProductsC,
  getProductByIdC,
  updateProductC,
  productSearchC,
  getAllStoreProductsC,
} from "../controllers/productController.js";

import {
  productSchema,
  updateProductSchema,
} from "../Models/Validations/ProductSchema.js";

const router = express.Router();

router.post(
  "/",
  verifySchema(productSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  createProductC,
);

router.put(
  "/:id",
  verifySchema(updateProductSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  updateProductC,
);

router.get("/", getAllProductsC);
router.get("/store", getAllStoreProductsC);

router.get("/search", productSearchC);
router.get("/:id", getProductByIdC);

router.delete("/:id",
  auth.authenticateToken,
  auth.requireAdmin,
  deleteProductC);

export default router;
