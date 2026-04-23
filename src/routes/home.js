import express from "express";
// import authMiddleware from '../middleware/auth.js';
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
    getHomeDataC
} from "../controllers/homeController.js";
const router = express.Router();



router.get("/", getHomeDataC);

export default router;
