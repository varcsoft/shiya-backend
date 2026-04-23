import prisma, { generateUUID } from "../config/database.js";

const getAllActiveFaqs = async ({ status = true } = {}) => {
  return await prisma.faqs.findMany({
    where: {
      status: status,
    },
  });
};


const createFaq = async (faqData) => {
  return await prisma.faqs.create({
    data: {
      id: generateUUID(),
      ...faqData,
    },
  });
};
const getFaqById = async (faqId) => {
  return await prisma.faqs.findUnique({
    where: {
      id: faqId,
      status: true,
    },
  });
};

const deleteFaq = async (faqId) => {
  return await prisma.faqs.delete({
    where: {
      id: faqId,
    },
  });
};

const updateFaq = async (faqId, faqData) => {
  return await prisma.faqs.update({
    where: {
      id: faqId,
    },
    data: {
      ...faqData,
    },
  });
};
export { createFaq, deleteFaq, getFaqById, getAllActiveFaqs, updateFaq };
