import prisma, { generateUUID } from "../config/database.js";

const createSubCategory = async (subCategoryData) => {
  return await prisma.subcategory.create({
    data: {
      id: generateUUID(),
      ...subCategoryData,
    },
  });
};
const getSuperspecifications = async () => {
  return await prisma.superspecification.findMany();
};

export { createSubCategory, getSuperspecifications };
