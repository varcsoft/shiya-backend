import responseConfig from "../config/response.js";
import { getPresignedUrl } from "../config/s3.js";

const getPresignedUrlC = async (req, res) => {
  try {
    const filename = req.query.filename;
    const userId = req.user.id;
    if (!filename) {
      return responseConfig.sendError(res, 400, 3003);
    }

    const name = userId + Date.now() + filename;
    console.log(name);
    const url = await getPresignedUrl(name);

    return responseConfig.sendSuccess(res, 200, "URL generated successfully", {
      url: url,
    });
  } catch (error) {
    return responseConfig.sendError(res, 500, error.message);
  }
};
export { getPresignedUrlC };
