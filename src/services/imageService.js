import prisma, { generateUUID } from "../config/database.js";

const createImage = async (imageData) => {
  return await prisma.images.create({
    id: generateUUID(),
    data: imageData,
  });
};
const createManyImages = async (imageData) => {
  return await prisma.images.createMany({
    skipDuplicates: true,
    data: imageData.map((img) => ({
      id: generateUUID(),
      ...img,
    })),
  });
};
const getImages = async () => {
  return await prisma.images.findMany();
};

const getImageById = async (id) => {
  return await prisma.images.findUnique({
    where: {
      id,
    },
  });
};
const getImageByName = async (name) => {
  return await prisma.images.findUnique({
    where: {
      name,
    },
  });
};

const updateImage = async (id, imageData) => {
  return await prisma.images.update({
    where: {
      id,
    },
    data: imageData,
  });
};

const deleteImage = async (id) => {
  return await prisma.images.delete({
    where: {
      id,
    },
  });
};

export {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
  getImageByName,
  createManyImages,
};
