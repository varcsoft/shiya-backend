import express from "express";
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createCategoryC,
  deleteCategoryC,
  getCategoriesC,
  getCategoryByIdC,
  updateCategoryC,
} from "../controllers/categoryController.js";
import { categorySchema } from "../Models/Validations/CategorySchema.js";

const router = express.Router();

router.post(
  "/",
  auth.authenticateToken,
  verifySchema(categorySchema),
  createCategoryC,
);

router.get("/", getCategoriesC);

router.put("/:id", auth.authenticateToken, updateCategoryC);

router.get("/:id", getCategoryByIdC);

router.delete("/:id", auth.authenticateToken, deleteCategoryC);

export default router;
