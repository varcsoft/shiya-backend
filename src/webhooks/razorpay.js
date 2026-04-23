import express from "express";
import auth from "../middleware/auth.js";
import {
  processOrder,
  processPayment,
} from "../controllers/razorpayController.js";
const router = express.Router();

router.post("/order", auth.checkRazorpayWebhook, processOrder);
router.post("/test/order", auth.checkRazorpayWebhook, processOrder);

router.post("/payment", auth.checkRazorpayWebhook, processPayment);
router.post("/test/payment", auth.checkRazorpayWebhook, processPayment);

export default router;
