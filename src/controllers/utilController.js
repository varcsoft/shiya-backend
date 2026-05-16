import { env } from "../config/env.js";
import response from "../config/response.js";
import delhiverySdk from "../sdks/delhivery.js";

const verifyPinCodeC = async (req, res) => {
  try {
    const pincodeServiceability = await delhiverySdk.getPincodeServiceability(req.body.pinCode);
    return response.sendSuccess(res, 200, "Pincode serviceability retrieved", pincodeServiceability);
  } catch (error) {
    console.error("Error retrieving pincode serviceability:", error);
    return response.sendError(res, 500, 1003);
  }
};
export { verifyPinCodeC };
