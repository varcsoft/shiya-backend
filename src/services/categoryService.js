import prisma, { generateUUID } from "../config/database.js";

const createCategory = async (categoryData) => {
  const { images, ...rest } = categoryData;
  return await prisma.category.create({
    data: {
      id: generateUUID(),
      ...rest,
      images: {
        createMany: {
          data: images.map((img) => ({
            id: generateUUID(),
            ...img,
          })),
        },
      },
    },
  });
};

const getCategories = async () => {
  return await prisma.category.findMany({
    include: {
      images: true,
      _count: {
        select: {
          products: true,
          subcategories: true,
        },
      },
    },
  });
};

const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },

    include: {
      images: true,
      subcategories: true,
      products: {
        where: {
          deleted: false,
        },
        include: {
          images: true,
        },
      },
      _count: {
        select: {
          products: true,
          subcategories: true,
        },
      },
    },
  });
};
const getCategoryByName = async (name) => {
  return await prisma.category.findUnique({
    where: {
      name,
    },
    include: {
      products: {
        include: {
          images: true,
        },
      },
      _count: {
        select: {
          products: true,
          subcategories: true,
        },
      },
    },
  });
};

const updateCategory = async (id, categoryData) => {
  return await prisma.category.update({
    where: {
      id: id,
    },
    data: categoryData,
  });
};

const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: {
      id: id,
    },
  });
};

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryByName,
};

//https://www.instagram.com/p/DQRwkoFjWPh/?epik=dj0yJnU9RWlkVG5qdkh6S052WEo4WWNiS2t3cFZYMmZ6UEFjcVYmcD0wJm49T0RiNHF1b0xjLVdPTUxqYzJ2eld3USZ0PUFBQUFBR21OdWUw
//https://i.pinimg.com/1200x/55/f7/2e/55f72e9d55fbaa096a643d34da6db65d.jpg
