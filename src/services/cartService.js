import prisma, { generateUUID } from "../config/database.js";
const addCartItem = async (data) => {
  const cart = await prisma.cart.create({
    data: {
      id: generateUUID(),
      ...data,
      custom: JSON.stringify(data.custom),
    },
  });
  return cart;
};

const getCartItemById = async (id) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: id,
    },
    include: {
      product: true,
      productVariant: true,
    },
  });
  return cart;
};

const getCartItems = async (userId) => {
  const carts = await prisma.cart.findMany({
    where: {
      userId,
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
  return carts;
};

const deleteAllCartItems = async (userId) => {
  const carts = await prisma.cart.deleteMany({
    where: {
      userId,
    },
  });
  return carts;
};

const deleteCartItem = async (id) => {
  const cart = await prisma.cart.delete({
    where: {
      id: id,
    },
  });
  return cart;
};

const deleteCartItemByProductId = async (productId) => {
  const cart = await prisma.cart.deleteMany({
    where: {
      productId: productId,
    },
  });
  return cart;
};

const updateCartItem = async (id, data) => {
  const cart = await prisma.cart.update({
    where: {
      id: id,
    },
    data: {
      ...data,
      custom: JSON.stringify(data.custom),
    },
  });
  return cart;
};

export {
  addCartItem,
  deleteCartItem,
  deleteAllCartItems,
  updateCartItem,
  deleteCartItemByProductId,
  getCartItems,
  getCartItemById,
};
