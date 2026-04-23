import prisma from "../config/database.js";
import response from "../config/response.js";
import { deleteCartItemByProductId } from "../services/cartService.js";
import { getCategoryById } from "../services/categoryService.js";
import { createManyImages } from "../services/imageService.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  getProductById,
  deleteProduct,
  upsertProductSpecifications,
  searchProducts,
  deleteSpecifications,
  upsertVariantSpecifications,
} from "../services/productService.js";
import {
  createProductVariants,
  deleteVariantImages,
  deleteVariantSpecifications,
  getVariantByVariantAndProductId,
  updateVariant,
} from "../services/productVariantService.js";
import { getSubCategoryById } from "../services/subCategoryService.js";
import { getDefaultVariantByProductId } from "./variantController.js";

const createProductC = async (req, res) => {
  try {
    const { categoryId, subcategoryId, productVariants, ...productData } =
      req.body;
    let category = null;
    if (categoryId) {
      category = await getCategoryById(categoryId);
      if (!category) {
        return response.sendError(res, 400, 2002);
      }
    }
    if (subcategoryId && category) {
      const subCategory = category.subcategories.find(
        (e) => e.id === subcategoryId,
      );
      if (!subCategory) {
        return response.sendError(res, 400, 2003);
      }
    }
    console.log("categoryId", categoryId);
    console.log("subcategoryId", subcategoryId);

    const product = await createProduct({
      categoryId: categoryId ? categoryId : null,
      subcategoryId: subcategoryId ? subcategoryId : null,
      ...productData,
    });
    if (productVariants) {
      await createProductVariants(productVariants, product.id);
    }
    return response.sendSuccess(
      res,
      201,
      "Product created successfully",
      product,
    );
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};
const getAllProductsC = async (req, res) => {
  try {
    console.log("Get all Products");
    const products = await getProducts();
    return response.sendSuccess(
      res,
      200,
      "Products fetched successfully",
      products,
    );
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};
const getAllStoreProductsC = async (req, res) => {
  try {
    console.log("Get all Products");
    const products = await getProducts({
      deleted: false,
    });
    return response.sendSuccess(
      res,
      200,
      "Products fetched successfully",
      products,
    );
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};

const getProductByIdC = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return response.sendError(res, 404, 2000);
    }
    return response.sendSuccess(
      res,
      200,
      "Product fetched successfully",
      product,
    );
  } catch (error) {
    return response.sendError(res, 400, 999);
  }
};

const deleteProductC = async (req, res) => {
  try {
    const productExist = await getProductById(req.params.id);
    if (!productExist) {
      return response.sendError(res, 404, 2000);
    }
    await deleteProduct(req.params.id);
    return response.sendSuccess(
      res,
      204,
      "Product marked as deleted successfully",
    );
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};

const updateProductC = async (req, res) => {
  try {
    const {
      categoryId,
      subcategoryId,
      productVariants,
      images,
      specifications,
      ...productData
    } = req.body;
    let category = null;
    if (categoryId) {
      category = await getCategoryById(categoryId);
      if (!category) {
        return response.sendError(res, 400, 2002);
      }
    }
    if (subcategoryId && category) {
      const subCategory = category.subcategories.find(
        (e) => e.id === subcategoryId,
      );
      if (!subCategory) {
        return response.sendError(res, 400, 2003);
      }
    }
    const productExist = await getProductById(req.params.id);
    if (!productExist) {
      return response.sendError(res, 404, 2000);
    }
    const product = await updateProduct(req.params.id, {
      categoryId: categoryId ? categoryId : null,
      subcategoryId: subcategoryId ? subcategoryId : null,
      ...productData,
    });

    specifications
      .filter((spec) => spec.deleted == true)
      .map(async (spec) => {
        await deleteSpecifications(spec.id);
      });
    if (specifications && specifications.length > 0) {
      await upsertProductSpecifications(product.id, specifications);
    }
    if (images && images.length > 0) {
      const manyImages = images.map((image) => ({
        ...image,
        productId: product.id,
      }));
      await createManyImages(manyImages);
    }
    // Default Variant Update
    const defaultVariant = await getDefaultVariantByProductId(product.id);
    const variantId = defaultVariant.id;
    const payload = {
      rating: productData?.rating,
      price: productData?.price,  
      stock: productData?.stock,      
      enableOffer: productData?.enableOffer,
      offerPrice: productData?.offerPrice,
      quantityType: productData?.quantityType,
    };
    // keep only fields with values
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => value !== undefined),
    );
    const variant = await updateVariant(variantId, filteredPayload);
    await deleteVariantSpecifications(variantId);
    if (specifications && specifications.length > 0) {
      await upsertVariantSpecifications(
        variant.id,
        specifications.filter((spec) => spec.deleted !== true),
      );
    }
    await deleteVariantImages(variantId);
    if (images && images.length > 0) {
      const manyImages = images.map((image) => ({
        ...image,
        productVariantId: variant.id,
      }));
      await createManyImages(manyImages);
    }
    // Default Variant Updated
    return response.sendSuccess(
      res,
      200,
      "Product updated successfully",
      product,
    );
  } catch (error) {
    console.log(error);
    return response.sendError(res, 400, 999);
  }
};

const productSearchC = async (req, res) => {
  try {
    console.log(req.query);
    const { search, category, priceRange, selectedDiscounts } = req.query;
    console.log("search ", search);
    const products = await searchProducts({ search, category, priceRange });
    return response.sendSuccess(
      res,
      200,
      "Products fetched successfully",
      products,
    );
  } catch (error) {
    console.log("Error", error);
    return response.sendError(res, 400, 999);
  }
};

export {
  createProductC,
  productSearchC,
  getAllProductsC,
  getAllStoreProductsC,
  getProductByIdC,
  deleteProductC,
  updateProductC,
};
