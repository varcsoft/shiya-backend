import response from "../config/response.js";
import delhiverySdk from "../sdks/delhivery.js";

export const checkPinCodeServiceAvailable = async (req, res, next) => {
  try {
    const pinCode = req.body.pinCode;
    const isAvailable = await delhiverySdk.getPincodeServiceability(pinCode);
    if (!isAvailable.status || isAvailable.status === "false") {
      return response.sendError(res, 400, 1013);
    }
    next();
  } catch (error) {
    console.error("Check Pin Code Service Available middleware error:", error);
    return response.sendError(res, 500, 999);
  }
};
