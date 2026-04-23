import express from "express";
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createSubCategoryC,
  deleteSubCategoryC,
  getSubCategoriesC,
  getSubCategoryByCategoryIdC,
  getSubCategoryByIdC,
  updateSubCategoryC,
} from "../controllers/subCategoryController.js";
import { subCategorySchema } from "../Models/Validations/CategorySchema.js";

const router = express.Router();

router.post(
  "/",
  verifySchema(subCategorySchema),
  auth.authenticateToken,
  createSubCategoryC
);

router.get("/", auth.authenticateToken, getSubCategoriesC);

router.get(
  "/category/:id",
  auth.authenticateToken,
  getSubCategoryByCategoryIdC
);

router.get("/:id", auth.authenticateToken, getSubCategoryByIdC);

router.put("/:id", auth.authenticateToken, updateSubCategoryC);

router.delete("/:id", auth.authenticateToken, deleteSubCategoryC);

export default router;
