import prisma from "../config/database.js";

const getAnalytics = async () => {
  const [
    totalUsers,
    totalOrders,
    totalProducts,
    totalCategories,
    totalSubcategories,
    totalTransactions,
    totalImages,
  ] = await prisma.$transaction([
    prisma.user.groupBy({
      by: ["roleId"],
      _count: {
        _all: true,
      },
    }),
    prisma.order.groupBy({
      by: ["orderStatus"],
      _count: {
        orderStatus     : true,
      },
    }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.subcategory.count(),
    prisma.transaction.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.images.count(),
  ]);

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    totalCategories,
    totalSubcategories,
    totalTransactions,
    totalImages,
  };
};

export { getAnalytics };
