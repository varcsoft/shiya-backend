import pkg from '@prisma/client';
const { Prisma } = pkg;
import response from "../config/response.js";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
} from "../services/subCategoryService.js";
import { getCategoryById } from "../services/categoryService.js";

const createSubCategoryC = async (req, res) => {
  try {
    const categoryExists = await getCategoryById(req.body.categoryId);
    if (!categoryExists) {
      return response.sendError(res, 400, 2002);
    }
    const subCategory = await createSubCategory(req.body);
    return response.sendSuccess(res, 201, "SubCategory created", {
      subCategory,
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

const getSubCategoriesC = async (req, res) => {
  try {
    const subCategories = await getSubCategories();
    return response.sendSuccess(
      res,
      200,
      "SubCategories retrieved",
      subCategories
    );
  } catch (error) {
    console.error("Error retrieving subCategories:", error);
    return response.sendError(res, 500, 1003);
  }
};

const getSubCategoryByIdC = async (req, res) => {
  try {
    const subCategory = await getSubCategoryById(req.params.id);
    if (!subCategory) {
      return response.sendError(res, 400, 2003);
    }
    return response.sendSuccess(res, 200, "SubCategory retrieved", subCategory);
  } catch (error) {
    console.error("Error retrieving subCategory:", error);
    return response.sendError(res, 500, 1003);
  }
};
const getSubCategoryByCategoryIdC = async (req, res) => {
  try {
    const subCategories = await getSubCategoryByCategoryId(req.params.id);
    if (!subCategories) {
      return response.sendError(res, 400, 2003);
    }
    return response.sendSuccess(
      res,
      200,
      "SubCategories retrieved",
      subCategories
    );
  } catch (error) {
    console.error("Error retrieving subCategories:", error);
    return response.sendError(res, 500, 1003);
  }
};

const updateSubCategoryC = async (req, res) => {
  try {
    const categoryExists = await getCategoryById(req.body.categoryId);
    if (!categoryExists) {
      return response.sendError(res, 400, 2002);
    }
    const subCategory = await updateSubCategory(req.params.id, req.body);
    if (!subCategory) {
      return response.sendError(res, 400, 2003);
    }
    return response.sendSuccess(res, 200, "SubCategory updated", {
      subCategory,
    });
  } catch (error) {
    console.error("Error updating subCategory:", error);
    return response.sendError(res, 500, 1003);
  }
};

const deleteSubCategoryC = async (req, res) => {
  try {
    const subCategory = await deleteSubCategory(req.params.id);
    if (!subCategory) {
      return response.sendError(res, 400, 2003);
    }
    return response.sendSuccess(res, 204, "SubCategory deleted successfully");
  } catch (error) {
    console.error("Error deleting subCategory:", error);
    return response.sendError(res, 500, 1003);
  }
};

export {
  createSubCategoryC,
  getSubCategoriesC,
  getSubCategoryByIdC,
  updateSubCategoryC,
  deleteSubCategoryC,
  getSubCategoryByCategoryIdC,
};
