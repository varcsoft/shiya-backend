import response from "../config/response.js";
import {
  deleteImage,
  getImageById,
  getImages,
} from "../services/imageService.js";

const getImagesC = async (req, res) => {
  try {
    const images = await getImages();
    return response.sendSuccess(res, 200, "Images retrieved", images);
  } catch (error) {
    console.error("Error retrieving images:", error);
    return response.sendError(res, 500, 1003);
  }
};

const getImageByIdC = async (req, res) => {
  try {
    const image = await getImageById(req.params.id);
    if (!image) {
      return response.sendError(res, 404, 2005);
    }
    return response.sendSuccess(res, 200, "Image retrieved", image);
  } catch (error) {
    console.error("Error retrieving image:", error);
    return response.sendError(res, 500, 1003);
  }
};

const deleteImageC = async (req, res) => {
  try {
    const imageExist = await getImageById(req.params.id);
    if (!imageExist) {
      return response.sendError(res, 404, 2005);
    }
    await deleteImage(req.params.id);
    return response.sendSuccess(res, 204, "Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.sendError(res, 500, 1003);
  }
};

export { getImagesC, getImageByIdC, deleteImageC };
