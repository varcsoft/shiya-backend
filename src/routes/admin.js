import express from "express";
import auth from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboardController.js";


const router = express.Router();
router.get(
  "/dashboard",
  auth.authenticateToken,
  auth.requireAdmin,
  getDashboard
);

export default router;
