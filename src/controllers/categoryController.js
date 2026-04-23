import pkg from '@prisma/client';
const { Prisma } = pkg;
import response from "../config/response.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";
import { createImage, createManyImages } from "../services/imageService.js";

const createCategoryC = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    return response.sendSuccess(res, 201, "Category created", {
      category,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("error.meta", error.meta);
      if (error.code == "P2002") {
        return response.sendError(
          res,
          400,
          998,
          {},
          { targets: error.meta.target }
        );
      }
    }
    return response.sendError(res, 500, 999);
  }
};

const getCategoriesC = async (req, res) => {
  try {
    const categories = await getCategories();
    return response.sendSuccess(res, 200, "Categories retrieved", categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return response.sendError(res, 500, 1003);
  }
};

const getCategoryByIdC = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return response.sendError(res, 400, 2002);
    }
    return response.sendSuccess(res, 200, "Category retrieved", {
      category,
    });
  } catch (error) {
    console.error("Error retrieving category:", error);
    return response.sendError(res, 500, 1003);
  }
};

const updateCategoryC = async (req, res) => {
  try {
    const categoryExist = await getCategoryById(req.params.id);
    if (!categoryExist) {
      return response.sendError(res, 404, 2002);
    }
    const { images, ...data } = req.body;
    const category = await updateCategory(req.params.id, data);
    if (images && images.length > 0) {
      const manyImages = images.map((image) => ({
        ...image,
        categoryId: category.id,
      }));
      await createManyImages(manyImages);
    }
    if (!category) {
      return response.sendError(res, 400, 1002);
    }
    return response.sendSuccess(res, 200, "Category updated", {
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return response.sendError(res, 500, 999);
  }
};

const deleteCategoryC = async (req, res) => {
  try {
    const category = await deleteCategory(req.params.id);
    if (!category) {
      return response.sendError(res, 400, 1002);
    }
    return response.sendSuccess(res, 204, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return response.sendError(res, 500, 1003);
  }
};

export {
  createCategoryC,
  getCategoriesC,
  getCategoryByIdC,
  updateCategoryC,
  deleteCategoryC,
};
