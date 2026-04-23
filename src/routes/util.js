import express from "express";
import auth from "../middleware/auth.js";
import { verifyPinCodeC } from "../controllers/utilController.js";

const router = express.Router();

router.get("/pincode/verify", auth.authenticateToken, verifyPinCodeC);

export default router;
