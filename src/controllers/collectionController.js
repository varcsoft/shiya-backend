import response from "../config/response.js";
import {
  deleteCollectionItem,
  getCollectionItemById,
} from "../services/collectionItemService.js";
import {
  createCollection,
  deleteCollectionItems,
  getCollectionByKey,
} from "../services/collectionService.js";

import {
  deleteCollection,
  getCollectionById,
  getCollections,
  updateCollection,
} from "../services/collectionService.js";

const createCollectionC = async (req, res) => {
  try {
    const collection = await createCollection(req.body);
    return response.sendSuccess(res, 200, "Collection created", collection);
  } catch (error) {
    console.error("Error creating collection:", error);
    return response.sendError(res, 500, 999);
  }
};

const deleteCollectionC = async (req, res) => {
  try {
    const collection = await deleteCollection(req.params.key);
    return response.sendSuccess(res, 200, "Collection deleted", collection);
  } catch (error) {
    console.error("Error deleting collection:", error);
    return response.sendError(res, 500, 999);
  }
};

const getCollectionsC = async (req, res) => {
  try {
    const collections = await getCollections();
    return response.sendSuccess(res, 200, "Collections fetched", collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return response.sendError(res, 500, 999);
  }
};
const getCollectionByKeyC = async (req, res) => {
  try {
    const collection = await getCollectionByKey(req.params.key);
    return response.sendSuccess(res, 200, "Collection fetched", collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return response.sendError(res, 500, 999);
  }
};

const getCollectionByIdC = async (req, res) => {
  try {
    const collection = await getCollectionById(req.params.id);
    return response.sendSuccess(res, 200, "Collection fetched", collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return response.sendError(res, 500, 999);
  }
};

const updateCollectionC = async (req, res) => {
  try {
    await deleteCollectionItems(req.params.key);
    const collection = await updateCollection(req.params.key, req.body);
    return response.sendSuccess(res, 200, "Collection updated", collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return response.sendError(res, 500, 999);
  }
};
const deleteCollectionItemC = async (req, res) => {
  try {
    const collectionItem = await getCollectionItemById(req.params.id);
    if (!collectionItem) {
      return response.sendError(res, 404, 2009);
    }
    await deleteCollectionItem(req.params.id);
    return response.sendSuccess(
      res,
      200,
      "Collection item deleted",
      collectionItem,
    );
  } catch (error) {
    console.error("Error deleting collection item:", error);
    return response.sendError(res, 500, 999);
  }
};

export {
  createCollectionC,
  deleteCollectionC,
  getCollectionsC,
  getCollectionByKeyC,
  getCollectionByIdC,
  updateCollectionC,
  deleteCollectionItemC,
};
