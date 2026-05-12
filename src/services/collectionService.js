import prisma, { generateUUID } from "../config/database.js";

const createCollection = async (collectionData) => {
  const { collection_products, ...collectionDataRest } = collectionData;
  const collection = await prisma.$transaction(async (tx) => {
    const collection = await tx.collection.create({
      data: {
        id: generateUUID(),
        ...collectionDataRest,
      },
    });
    await tx.collection_product.createMany({
      skipDuplicates: true,
      data: collection_products.map((product) => ({
        id: generateUUID(),
        collectionId: collection.id,
        productId: product.productId,
      })),
    });
    return collection;
  });
  return collection;
};

const getCollections = async () => {
  const collections = await prisma.collection.findMany({
    include: {
      collection_products: {
        where: {
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        include: {
          product: {
            include: {
              category: true,
              productVariants: true,
              images: true,
            },
          },
        },
      },
      _count: {
        select: {
          collection_products: {
            where: {
              product: {
                NOT: {
                  deleted: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return collections;
};

const getCollectionById = async (id) => {
  const collection = await prisma.collection.findUnique({
    where: {
      id,
    },
    include: {
      collection_products: true,
    },
  });
  return collection;
};

const getCollectionByKey = async (key) => {
  const collection = await prisma.collection.findUnique({
    where: {
      key,
    },
    include: {
      collection_products: {
        where: {
          product: {
            NOT: {
              deleted: true,
            },
          },
        },
        include: {
          product: {
            
            include: {
              
              productVariants: true,
              images: true,
            },
          },
        },
      },
    },
  });
  return collection;
};

const deleteCollection = async (key) => {
  const collection = await prisma.collection.delete({
    where: {
      key,
    },
  });
  return collection;
};

const updateCollection = async (key, collectionData) => {
  const { collection_products, ...collectionDataRest } = collectionData;
  const collection = await prisma.$transaction(async (tx) => {
    const collection = await tx.collection.update({
      where: {
        key,
      },
      data: collectionDataRest,
    });
    await tx.collection_product.createMany({
      skipDuplicates: true,
      data: collection_products.map((product) => ({
        id: generateUUID(),
        collectionId: collection.id,
        productId: product.productId,
      })),
    });
    return collection;
  });
  return collection;
};

const deleteCollectionItems = async (key) => {
  await prisma.collection_product.deleteMany({
    where: {
      collection: {
        key,
      },
    },
  });
};

export {
  createCollection,
  getCollections,
  getCollectionById,
  getCollectionByKey,
  deleteCollection,
  updateCollection,
  deleteCollectionItems,
};
