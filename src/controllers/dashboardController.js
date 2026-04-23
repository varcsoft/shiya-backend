import response from "../config/response.js";
import { getAnalytics } from "../services/dashboardService.js";

const getDashboard = async (req, res) => {
  try {
    const analytics = await getAnalytics();
    return response.sendSuccess(res, 200, "Dashboard Data", analytics);
  } catch (error) {
    console.log(error);
    return response.sendError(res, 500, 999);
  }
};

export { getDashboard };
