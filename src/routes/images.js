import express from "express";
import auth from "../middleware/auth.js";
import {
  getImagesC,
  getImageByIdC,
  deleteImageC,
} from "../controllers/imagesController.js";

const router = express.Router();

router.get("/", auth.authenticateToken, getImagesC);

router.get("/:id", auth.authenticateToken, getImageByIdC);

router.delete("/:id", auth.authenticateToken, deleteImageC);

export default router;
