import prisma, { generateUUID } from "../config/database.js";
const createProduct = async (productData) => {
  const { images, productVariants, specifications, ...remainingData } =
    productData;
  let product = {};
  await prisma.$transaction(async (tx) => {
    product = await tx.product.create({
      data: {
        id: generateUUID(),
        images: {
          createMany: {
            data: images.map((image) => ({
              ...image,
              id: generateUUID(),
            })),
          },
        },
        ...(specifications && {
          specifications: {
            createMany: {
              data: specifications.map((spec) => ({
                ...spec,
                id: generateUUID(),
              })),
            },
          },
        }),
        ...remainingData,
      },
      include: {
        images: true,
        specifications: true,
        productVariants: true,
      },
    });
    await tx.product_variant.create({
      data: {
        id: generateUUID(),
        productId: product.id,
        label: "DEFAULT",
        stock: remainingData.stock,
        quantityType: remainingData.quantityType,
        price: remainingData.price,
        offerPrice: remainingData.offerPrice,
        enableOffer: remainingData.enableOffer,
        stock: remainingData.stock,
        ...(specifications && {
          specifications: {
            createMany: {
              data: specifications.map((spec) => ({
                ...spec,
                id: generateUUID(),
              })),
            },
          },
        }),
      },
    });
  });
  return product;
};

const searchProducts = async ({ query, category, priceRange, take }) => {
  // const products = await prisma.product.findMany({
  //   where: {
  //     deleted: false,
  //     OR: [
  //       // {
  //       //   name: {
  //       //     contains: query,
  //       //     mode: "insensitive",
  //       //   },
  //       // },
  //       // {
  //       //   price: {
  //       //     gte: priceRange[0],
  //       //     lte: priceRange[1],
  //       //   },
  //       // },
  //       // category !== null || category !== "All"
  //       //   ? {
  //       //       category: {
  //       //         name: {
  //       //           contains: category,
  //       //           mode: "insensitive",
  //       //         },
  //       //       },
  //       //     }
  //       //   : null,
  //       // {
  //       //   description: {
  //       //     contains: query,
  //       //     mode: "insensitive",
  //       //   },
  //       // },
  //     ],
  //   },
  //   orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
  //   take: take,
  // });
  const where = {
    deleted: false,
  };
  console.log("category", category);
  if ((category && category.trim() !== "") || category === "All") {
    where.category = {
      name: {
        contains: category,
        mode: "insensitive",
      },
    };
  }
  console.log(where);

  const products = await prisma.product.findMany({
    where: where,
    include: {
      links: true,
      wishlists: true,
      images: true,
      specifications: true,
      category: {
        include: {
          images: true,
        },
      },
      subcategory: {
        include: {
          images: true,
        },
      },
      productVariants: {
        include: {
          images: true,
        },
      },
    },
  });
  return products;
};

const getProducts = async (query) => {
  const products = await prisma.product.findMany({
    where: query,
    orderBy: [{ deleted: "asc" }, { id: "asc" }],
    include: {
      links: true,
      wishlists: true,
      images: true,
      specifications: {
        include: {
          superspecification: true,
        },
      },

      category: {
        include: {
          images: true,
        },
      },
      subcategory: {
        include: {
          images: true,
        },
      },
      productVariants: {
        include: {
          images: true,
        },
      },
    },
  });
  return products;
};
const getDefaultVariant = async (productId) => {
  const variant = await prisma.product_variant.findFirst({
    where: {
      productId: productId,
      label: "DEFAULT",
    },
  });
  return variant;
};
const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      links: true,
      specifications: true,
      images: true,
      linkedProducts: true,
      category: {
        include: {
          images: true,
        },
      },
      collectionProducts: {
        include: {
          collection: true,
        },
      },
      subcategory: {
        include: {
          images: true,
        },
      },
      productVariants: {
        include: {
          specifications: true,
          images: true,
        },
      },
    },
  });
  return product;
};

const updateProduct = async (id, productData) => {
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: productData,
  });
  return product;
};

const deleteSpecifications = async (specId) => {
  await prisma.specification.delete({
    where: {
      id: specId,
    },
  });
};



const upsertProductSpecifications = async (productId, specifications = []) => {
  return Promise.all(
    specifications.filter((spec) => spec.deleted !== true).map((spec) =>
      prisma.specification.upsert({
        where: {
          productId_label: {
            productId: productId,
            label: spec.label,
          },
        },
        update: {
          value: spec.value,
          sort: spec.sort ?? null,
        },
        create: {
          id: generateUUID(),
          productId: productId,
          label: spec.label,
          value: spec.value,
          sort: spec.sort ?? null,
        },
      }),
    ),
  );
};
const upsertVariantSpecifications = async (variantId, specifications = []) => {
  return Promise.all(
    specifications.map((spec) =>
      prisma.specification.upsert({
        where: {
          variantId_label: {
            variantId: variantId,
            label: spec.label,
          },
        },
        update: {
          value: spec.value,
          sort: spec.sort ?? null,
        },
        create: {
          id: generateUUID(),
          variantId: variantId,
          label: spec.label,
          value: spec.value,
          sort: spec.sort ?? null,
        },
      }),
    ),
  );
};

const deleteProduct = async (id) => {
  const product = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      deleted: true,
    },
  });
  return product;
};

export {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  searchProducts,
  getDefaultVariant,
  upsertProductSpecifications,
  deleteSpecifications,
  upsertVariantSpecifications,
};
