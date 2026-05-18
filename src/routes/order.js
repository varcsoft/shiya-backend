import express from "express";
// import authMiddleware from '../middleware/auth.js';
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createOrderC,
  deleteOrderC,
  getAllOrdersC,
  getOrderByIdC,
  getOrdersC,
  getOrderReportC,
  updateOrderStatusC,
  createOrderFromCartC,
} from "../controllers/orderController.js";
import {
  orderFromCartSchema,
  orderSchema,
  orderStatusSchema,
} from "../Models/Validations/OrderSchema.js";

const router = express.Router();

router.post(
  "/",
  verifySchema(orderSchema),
  auth.authenticateToken,
  createOrderC
);

router.post(
  "/cart",
  verifySchema(orderFromCartSchema),
  auth.authenticateToken,
  createOrderFromCartC
);

router.get("/", auth.authenticateToken, getOrdersC);
router.get("/report", auth.authenticateToken, getOrderReportC);

router.get("/all", auth.authenticateToken, auth.requireAdmin, getAllOrdersC);

router.put(
  "/status/:id",
  verifySchema(orderStatusSchema),
  auth.authenticateToken,
  auth.requireAdmin,
  updateOrderStatusC
);

router.get("/:id", auth.authenticateToken, getOrderByIdC);

router.delete(
  "/:id",
  auth.authenticateToken,
  auth.requireAdmin,
  deleteOrderC
);

export default router;
