import express from "express";
import razorpayWebhooks from "./razorpay.js";
const webhooks = express.Router();

webhooks.use("/razorpay", razorpayWebhooks);

export default webhooks;
