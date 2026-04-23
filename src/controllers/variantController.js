import response from "../config/response.js";
import { createManyImages } from "../services/imageService.js";
import {
  deleteSpecifications,
  getProductById,
  upsertVariantSpecifications,
} from "../services/productService.js";

import {
  createProductVariant,
  getVariants,
  updateVariant,
  getVariantById,
  deleteVariant,
  getVariantByVariantAndProductId,
  getVariantsByProductId,
} from "../services/productVariantService.js";

const createProductVariantC = async (req, res) => {
  try {
    const data = req.body;
    if (data.label == "DEFAULT") {
      return response.sendError(res, 400, 2001);
    }
    const productExist = await getProductById(data.productId);
    if (!productExist) {
      return response.sendError(res, 404, 2000);
    }

    const variant = await createProductVariant(data);
    return response.sendSuccess(
      res,
      201,
      "Variant created successfully",
      variant,
    );
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};
const getDefaultVariantByProductId = async (productId) => {
  const variants = await getVariantsByProductId(productId);
  return variants.find((variant) => variant.label == "DEFAULT");
};
const getAllVariantsC = async (req, res) => {
  try {
    const variants = await getVariants();
    return response.sendSuccess(
      res,
      200,
      "Variants fetched successfully",
      variants,
    );
  } catch (error) {
    return response.sendError(res, 400, error.message);
  }
};
const getAllVariantsByProductIdC = async (req, res) => {
  try {
    const productExist = await getProductById(req.params.id);
    if (!productExist) {
      return response.sendError(res, 404, 2000);
    }
    const variants = await getVariantsByProductId(req.params.id);
    return response.sendSuccess(
      res,
      200,
      "Variants fetched successfully",
      variants,
    );
  } catch (error) {
    return response.sendError(res, 400, error.message);
  }
};

const getVariantByIdC = async (req, res) => {
  try {
    const variant = await getVariantById(req.params.id, {
      images: true,
    });
    if (variant.label == "DEFAULT") {
      return response.sendError(res, 400, 2001);
    }
    if (!variant) {
      return response.sendError(res, 404, 2004);
    }
    return response.sendSuccess(
      res,
      200,
      "Variant fetched successfully",
      variant,
    );
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};

const deleteVariantC = async (req, res) => {
  try {
    const variantExist = await getVariantById(req.params.id);
    if (variantExist.label == "DEFAULT") {
      return response.sendError(res, 400, 2001);
    }
    if (!variantExist) {
      return response.sendError(res, 404, 2004);
    }
    const variant = await deleteVariant(req.params.id);
    return response.sendSuccess(
      res,
      200,
      "Variant deleted successfully",
      variant,
    );
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};

const updateVariantC = async (req, res) => {
  try {
    const variantId = req.params.id;
    const { productId, images, specifications, ...payload } = req.body;
    const variantExist = await getVariantByVariantAndProductId(
      variantId,
      productId,
    );
    if (!variantExist) {
      return response.sendError(res, 404, 2004);
    }
    const variant = await updateVariant(variantId, payload);
    specifications
      .filter((spec) => spec.deleted == true)
      .map(async (spec) => {
        await deleteSpecifications(spec.id);
      });
    if (specifications && specifications.length > 0) {
      await upsertVariantSpecifications(
        variant.id,
        specifications.filter((spec) => spec.deleted !== true),
      );
    }
    if (images && images.length > 0) {
      const manyImages = images.map((image) => ({
        ...image,
        productVariantId: variant.id,
      }));
      await createManyImages(manyImages);
    }
    return response.sendSuccess(
      res,
      200,
      "Variant updated successfully",
      variant,
    );
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};

export {
  createProductVariantC,
  getAllVariantsC,
  getDefaultVariantByProductId,
  getAllVariantsByProductIdC,
  getVariantByIdC,
  deleteVariantC,
  updateVariantC,
};
