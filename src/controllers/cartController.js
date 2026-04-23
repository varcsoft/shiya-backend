import response from "../config/response.js";
import {
  updateCartItem,
  deleteCartItem,
  getCartItems,
  addCartItem,
  getCartItemById,
  deleteAllCartItems,
} from "../services/cartService.js";
import { getProductById } from "../services/productService.js";

const createCartC = async (req, res) => {
  try {
    let { productId, productVariantId, quantity, custom } = req.body;
    const productExist = await getProductById(productId);
    if (!productExist) {
      return response.sendError(res, 400, 1012);
    }
    if (productVariantId) {
      const variantExist = productExist.productVariants.find(
        (variant) => variant.id === productVariantId
      );
      if (!variantExist) {
        return response.sendError(res, 400, 2004);
      }
    } else {
      const defaultVariant = productExist.productVariants.find(
        (variant) => variant.label === "DEFAULT"
      );
      if (!defaultVariant) {
        console.log("Default variant not found")
        return response.sendError(res, 400, 999);
      }
      productVariantId = defaultVariant.id;
    }

    const cart = await addCartItem({
      userId: req.user.id,
      productId,
      productVariantId,
      quantity: Number(quantity),
      custom: JSON.stringify(custom) ?? "{}",
    });
    return response.sendSuccess(
      res,
      201,
      "Item added to cart successfully",
      cart
    );
  } catch (error) {
    console.log(error);
    console.log("Unable to add cart Item")
    return response.sendError(res, 400, 999);
  }
};

const deleteAllCartC = async (req, res) => {
  try {
    const userId = req.user.id;
    await deleteAllCartItems(userId);
    return response.sendSuccess(res, 204, "Cart deleted successfully");
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};

const deleteCartC = async (req, res) => {
  try {
    const { id } = req.params;
    const cartExist = await getCartItemById(id);
    if (!cartExist) {
      return response.sendError(res, 400, 2008);
    }
    await deleteCartItem(id);
    return response.sendSuccess(res, 204, "Cart deleted successfully");
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};

const getCartsC = async (req, res) => {
  try {
    const userId = req.user.id;
    const carts = await getCartItems(userId);
    return response.sendSuccess(res, 200, "Carts fetched successfully", carts);
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};

const updateCartC = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, custom } = req.body;
    const cartExist = await getCartItemById(id);
    if (!cartExist) {
      return response.sendError(res, 400, 2008);
    }
    const cart = await updateCartItem(id, {
      quantity: Number(quantity),
      custom: JSON.stringify(custom) ?? "{}",
    });
    return response.sendSuccess(res, 200, "Cart updated successfully", cart);
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};

export { createCartC, deleteCartC, getCartsC, updateCartC, deleteAllCartC };
