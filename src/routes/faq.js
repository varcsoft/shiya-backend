import express from "express";
// import authMiddleware from '../middleware/auth.js';
import verifySchema from "../config/myzod.js";
import auth, { authenticateToken, requireAdmin } from "../middleware/auth.js";
import {
  getFaqsC,
  createFaqC,
  getFaqByIdC,
  deleteFaqC,
  updateFaqC,
} from "../controllers/faqController.js";
import {
  faqSchema
} from "../Models/Validations/faqSchema.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

router.get("/", getFaqsC);

router.post(
  "/",
  verifySchema(faqSchema),
  authenticateToken,
  requireAdmin,
  createFaqC,
);
router.get("/:id", getFaqByIdC);
router.delete("/:id", deleteFaqC);
router.put("/:id", updateFaqC);

export default router;
