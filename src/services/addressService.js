import prisma, { generateUUID } from "../config/database.js";

const insertAddress = async (userId, address) => {
  const newAddress = await prisma.address.create({
    data: {
      id: generateUUID(),
      ...address,
      userId: userId,
    },
  });
  return newAddress;
};
const updateAddressByIdAndUserId = async (addressId, userId, address) => {
  const newAddress = await prisma.address.update({
    where: {
      id: addressId,
      AND: [
        {
          userId: userId,
        },
      ],
    },
    data: address,
  });
  return newAddress;
};

const getAddressByUserId = async (userId) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId,
    },
  });
  return addresses;
};

const getAddressById = async (addressId) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });
  return address;
};

const getAddressByIdAndUserId = async (addressId, userId) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
      AND: [
        {
          userId: userId,
        },
      ],
    },
  });
  return address;
};

const deleteAddressByIdAndUserId = async (addressId, userId) => {
  const address = await prisma.address.delete({
    where: {
      id: addressId,
      AND: [
        {
          userId: userId,
        },
      ],
    },
  });
  return address;
};

export {
  insertAddress,
  getAddressByUserId,
  getAddressByIdAndUserId,
  updateAddressByIdAndUserId,
  deleteAddressByIdAndUserId,
};
