import express from "express";
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createWishlistC,
  getWishlistsC,
  deleteWishlistC,
} from "../controllers/wishlistController.js";
import { wishlistSchema } from "../Models/Validations/WishlistSchema.js";

const router = express.Router();

router.post(
  "/",
  auth.authenticateToken,
  verifySchema(wishlistSchema),
  createWishlistC,
);

router.get("/", auth.authenticateToken, getWishlistsC);

router.delete("/:id", auth.authenticateToken, deleteWishlistC);  

export default router;
