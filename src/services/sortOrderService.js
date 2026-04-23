import prisma from "../config/database.js";

const updateProductVariantSortOrder = async (productId, variants) => {
  await prisma.$transaction(
    variants.map((variant, index) =>
      prisma.product_variant.update({
        where: {
          id: variant.id,
          AND: {
            productId: productId,
          },
        },
        data: {
          sortOrder: index,
        },
      }),
    ),
  );
};
export { updateProductVariantSortOrder };
