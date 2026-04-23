import { generateUUID } from "../config/database.js";
import response from "../config/response.js";
import { getAllActiveFaqs } from "../services/faqService.js";
import { getLiveNotices } from "../services/homeService.js";
const getHomeDataC = async (req, res) => {
  try {
    const notice = await getLiveNotices();
    const faqs = await getAllActiveFaqs();
    const data = {
      notices: notice,
      faqs: faqs,
    };
    return response.sendSuccess(res, 200, "Home Data ", data);
  } catch (err) {
    console.error("Error fetching home data:", err);
    return response.sendError(res, 500, 999);
  }
};

export { getHomeDataC };
