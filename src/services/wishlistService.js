import prisma, { generateUUID } from "../config/database.js";

const createWishlistItem = async (userId, wishlistItemData) => {
  try {
    return await prisma.wishlist.create({
      data: {
        id: generateUUID(),
        userId: userId,
        ...wishlistItemData,
      },
    });
  } catch (error) {
    return error;
  }
};

const getWishlistByUserId = async (userId) => {
  return await prisma.wishlist.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
      productVariant: {
        include: {
          images: true,
        },
      },
    },
  });
};
const deleteWishlistItem = async (userId, wishlistItemId) => {
  return await prisma.wishlist.delete({
    where: {
      userId: userId,
      id: wishlistItemId,
    },
  });
};

export { createWishlistItem, getWishlistByUserId, deleteWishlistItem };
