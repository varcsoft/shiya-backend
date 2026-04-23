import prisma, { generateUUID } from "../config/database.js";

const createProductVariant = async (variant) => {
  const { images, specifications, ...remainingData } = variant;
  const newVariant = await prisma.product_variant.create({
    data: {
      id: generateUUID(),
      ...remainingData,
      ...(specifications && {
        specifications: {
          createMany: {
            data: specifications.map((spec) => ({
              id: generateUUID(),
              ...spec,
            })),
          },
        },
      }),
      images: {
        createMany: {
          data: images.map((img) => ({
            id: generateUUID(),
            ...img,
          })),
        },
      },
    },
  });
  return newVariant;
};
const getVariantByVariantAndProductId = async (variantId, productId) => {
  const variant = await prisma.product_variant.findUnique({
    where: {
      id: variantId,
      productId,
    },
    include: {
      product: true,
      images: true,
    },
  });
  return variant;
};

const createProductVariants = async (variants, productId) => {
  const products = await prisma.$transaction(
    variants.map(({ images, specifications, ...variant }) =>
      prisma.product_variant.create({
        data: {
          id: generateUUID(),
          ...(specifications && {
            specifications: {
              createMany: {
                data: specifications.map((spec) => ({
                  id: generateUUID(),
                  ...spec,
                })),
              },
            },
          }),
          ...variant,
          productId,
          images: {
            createMany: {
              data: images.map((img) => ({
                id: generateUUID(),
                ...img,
              })),
            },
          },
        },
      }),
    ),
  );
  return products;
};

const deleteVariantSpecifications = async (variantId) => {
  await prisma.specification.deleteMany({
    where: {
      variantId: variantId,
    },
  });
};

const deleteVariantImages = async (variantId) => {
  await prisma.images.deleteMany({
    where: {
      productVariantId: variantId,
    },
  });
};
const getVariants = async () => {
  const variants = await prisma.product_variant.findMany({
    include: {
      specifications: true,
    },
  });
  return variants;
};

const getVariantsByProductId = async (productId) => {
  const variants = await prisma.product_variant.findMany({
    where: {
      productId,
    },
    include: {
      specifications: true,
      _count: {
        select: {
          wishlists: true,
          carts: true,
        },
      },
    },
  });
  return variants;
};

const getVariantById = async (variantId, include) => {
  const variant = await prisma.product_variant.findUnique({
    where: {
      id: variantId,
    },
    include: {
      specifications: true,
      images: true,
      ...include,
    },
  });
  return variant;
};

const updateVariant = async (variantId, variant) => {
  const updatedVariant = await prisma.product_variant.update({
    where: {
      id: variantId,
    },
    data: variant,
  });
  return updatedVariant;
};

const deleteVariant = async (variantId) => {
  const deletedVariant = await prisma.product_variant.update({
    where: {
      id: variantId,
    },
    data: {
      deleted: true,
    },
  });
  return deletedVariant;
};

export {
  createProductVariant,
  createProductVariants,
  getVariantByVariantAndProductId,
  getVariants,
  getVariantsByProductId,
  getVariantById,
  updateVariant,
  deleteVariant,
  deleteVariantSpecifications,
  deleteVariantImages,
};
