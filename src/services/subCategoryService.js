import prisma, { generateUUID } from "../config/database.js";

const createSubCategory = async (subCategoryData) => {
  return await prisma.subcategory.create({
    data: {
      id: generateUUID(),
      ...subCategoryData,
    },
  });
};

const getSubCategories = async () => {
  return await prisma.subcategory.findMany();
};

const getSubCategoryByCategoryId = async (categoryId) => {
  return await prisma.subcategory.findMany({
    where: {
      categoryId,
    },
    include:{
      _count:{
        select: {
          products: true,
        },
      }
    }
  });
};

const getSubCategoryById = async (id) => {
  return await prisma.subcategory.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};
const getSubCategoryByName = async (name) => {
  return await prisma.subcategory.findUnique({
    where: {
      name,
    },
  });
};

const updateSubCategory = async (id, subCategoryData) => {
  return await prisma.subcategory.update({
    where: {
      id,
    },
    data: subCategoryData,
  });
};

const deleteSubCategory = async (id) => {
  return await prisma.subcategory.delete({
    where: {
      id,
    },
  });
};

export {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByName,
  getSubCategoryByCategoryId,
};
