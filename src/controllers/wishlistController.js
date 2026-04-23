import { prismaError } from "prisma-better-errors";
import response from "../config/response.js";
import { getWishlistByUserId } from "../services/wishlistService.js";
import {
  createWishlistItem,
  deleteWishlistItem,
} from "../services/wishlistService.js";
import { getProductById } from "../services/productService.js";

const createWishlistC = async (req, res) => {
  try {
    const productId = req.body.productId;
    const productExist = await getProductById(productId);
    if (!productExist) {
      return response.sendError(res, 400, 2000);
    }
    const variantExist = productExist.productVariants.find(
      (variant) => variant.id === req.body.productVariantId,
    );
    if (!variantExist) {
      return response.sendError(res, 400, 2000);
    }
    const wishlist = await createWishlistItem(req.user.id, req.body);
    return response.sendSuccess(res, 200, "Wishlist created", wishlist);
  } catch (error) {
    console.error("Error creating wishlist:", error);

    return response.sendError(res, 400, 999, "Variant does not exist");
  }
};

const deleteWishlistC = async (req, res) => {
  try {
    await deleteWishlistItem(req.user.id, req.params.id);
    return response.sendSuccess(res, 204, "Item removed from wishlist");
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return response.sendError(res, 400, 2000);
  }
};

const getWishlistsC = async (req, res) => {
  try {
    const wishlists = await getWishlistByUserId(req.user.id);
    return response.sendSuccess(res, 200, "Wishlists fetched", wishlists);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return response.sendError(res, 500, 999);
  }
};

export { createWishlistC, deleteWishlistC, getWishlistsC };
