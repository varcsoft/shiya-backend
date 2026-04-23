import express from "express";
import auth from "../middleware/auth.js";
import { getPresignedUrlC } from "../controllers/urlController.js";

const router = express.Router();

router.get("/", auth.authenticateToken, getPresignedUrlC);

export default router;
