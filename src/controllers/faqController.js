import response from "../config/response.js";
import {
  deleteFaq,
  getFaqById,
  getAllActiveFaqs,
  createFaq,
  updateFaq,
} from "../services/faqService.js";

const getFaqsC = async (req, res) => {
  try {
    const faqs = await getAllActiveFaqs();
    return response.sendSuccess(res, 200, "Faqs retrieved", faqs);
  } catch (error) {
    console.error("Error retrieving faqs:", error);
    return response.sendError(res, 500, 1003);
  }
};

const getFaqByIdC = async (req, res) => {
  try {
    const faq = await getFaqById(req.params.id);
    if (!faq) { 
      return response.sendError(res, 404, 2005);
    }
    return response.sendSuccess(res, 200, "Faq retrieved", faq);
  } catch (error) {
    console.error("Error retrieving faq:", error);
    return response.sendError(res, 500, 1003);
  }
};

const deleteFaqC = async (req, res) => {
  try {
    const faqExist = await getFaqById(req.params.id);
    if (!faqExist) {    
      return response.sendError(res, 404, 2005);
    }
    await deleteFaq(req.params.id);
    return response.sendSuccess(res, 204, "Faq deleted successfully");
  } catch (error) {
    console.error("Error deleting faq:", error);
    return response.sendError(res, 500, 1003);
  }
};

const createFaqC = async (req, res) => {
  try {
    const faq = await createFaq(req.body);
    return response.sendSuccess(res, 201, "Faq created successfully", faq);
  } catch (error) {
    console.error("Error creating faq:", error);
    return response.sendError(res, 500, 999);
  }
};
const updateFaqC = async (req, res) => {
  try {
    const faqExist = await getFaqById(req.params.id);
    if (!faqExist) {    
      return response.sendError(res, 404, 2005);
    }
    const faq = await updateFaq(req.params.id, req.body);
    return response.sendSuccess(res, 200, "Faq updated successfully", faq);
  } catch (error) {
    console.error("Error updating faq:", error);
    return response.sendError(res, 500, 1003);
  }
};


export { getFaqsC, getFaqByIdC, deleteFaqC, createFaqC, updateFaqC };
