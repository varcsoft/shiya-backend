import prisma, { generateUUID } from "../config/database.js";

const createCollectionItem = async (collectionItemData) => {
  return await prisma.collection_product.create({
    data: {
      id: generateUUID(),
      ...collectionItemData,
    },
  });
};
const getCollectionItemById = async (collectionItemId) => {
  return await prisma.collection_product.findUnique({
    where: {
      id: collectionItemId,
    },
  });
};

const deleteCollectionItem = async (collectionItemId) => {
  return await prisma.collection_product.delete({
    where: {
      id: collectionItemId,
    },
  });
};

export { createCollectionItem, deleteCollectionItem, getCollectionItemById };
