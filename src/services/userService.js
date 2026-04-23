import prisma, { generateUUID } from "../config/database.js";
import { roles } from "../config/seeder.js";

const getAllUsers = async () => {
  const userRole = await getRoleByName(roles.USER);
  return await prisma.user.findMany({
    where: {
      roleId: userRole.id,
    },
    include: {
      password: false,
      _count: {
        select: {
          carts: true,
          order: true,
          addresses: true,
        },
      },
    },
  });
};
// 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
const assignUserRole = async (userId) => {
  const userRole = await getRoleByName(roles.USER);
  return await prisma.user.update({
    where: { id: userId },
    data: { roleId: userRole.id },
    include: {
      role: true,
    },
  });
};
const getRoleByName = async (name) => {
  return await prisma.role.findUnique({
    where: { name },
  });
};
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      addresses: true,
      password: false,
      role: true,
      _count: {
        select: {
          carts: true,
          order: true,
          addresses: true,
        },
      },
    },
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const getUserByFirebaseUid = async (firebaseUid) => {
  return await prisma.user.findUnique({
    where: { firebaseUid },
  });
};
const updateUser = async (id, data) => {
  const res = await prisma.user.update({
    where: { id },
    data: {
      ...data,
    },
  });
  console.log(res);
  return res;
};
const createUser = async (data) => {
  const res = await prisma.user.create({
    data: {
      id: generateUUID(),
      ...data,
    },
  });
  return res;
};
export {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByFirebaseUid,
  updateUser,
  createUser,
  assignUserRole,
};
