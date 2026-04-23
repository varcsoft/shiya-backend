import prisma, { generateUUID } from "../config/database.js";

const createOrder = async (orderData) => {
  const order = await prisma.order.create({
    data: {
      id: generateUUID(),
      ...orderData,
    },
  });
  return order;
};

const getOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      productorders: true,
      transaction: {
        select: {
          status: true,
        },
      },
    },
  });
  return orders;
};
const getOrdersByDateRange = async (from, to) => {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    include: {
      user: {
        include: {
          addresses: true,
        },
      },
      productorders: true,
      address: true,
      transaction: {
        select: {
          status: true,
        },
      },
    },
  });
  return orders;
};

// await prisma.specification.updateMany({
//   where: {
//     value: "undefined"
//   },
//   data: {
//     value: "",
//   }
// })

const getOrderByOrderAndUserId = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: userId,
    },
  });
  return order;
};

const getOrdersByUserId = async (userId) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      productorders: true,
      transaction: {
        select: {
          status: true,
        },
      },
    },
  });
  return orders;
};
const getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
      productorders: {
        include: {
          product: {
            include: {
              specifications: true,
              images: true,
            },
          },
          images: true,
        },
      },
      address: true,
      transaction: {
        select: {
          status: true,
        },
      },
    },
  });
  return order;
};
const deleteOrder = async (id) => {
  const order = await prisma.order.delete({
    where: {
      id: id,
    },
  });
  return order;
};
const updateOrder = async (id, orderData) => {
  const order = await prisma.order.update({
    where: {
      id: id,
    },
    data: orderData,
  });
  return order;
};

export {
  createOrder,
  getOrders,
  getOrdersByUserId,
  getOrderById,
  getOrdersByDateRange,
  deleteOrder,
  getOrderByOrderAndUserId,
  updateOrder,
};
