import prisma, { generateUUID } from "../config/database.js";

const createOrderItem = async (orderItemData) => {
  return await prisma.productorder.create({
    data: {
      id: generateUUID(),
      ...orderItemData,
    },
  });
};

export { createOrderItem };
