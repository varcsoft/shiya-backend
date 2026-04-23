import express from "express";
import verifySchema from "../config/myzod.js";
import auth from "../middleware/auth.js";
import {
  createCollectionC,
  deleteCollectionC,
  getCollectionsC,
  getCollectionByIdC,
  updateCollectionC,
  getCollectionByKeyC,
  deleteCollectionItemC,
} from "../controllers/collectionController.js";
import { collectionSchema, updateCollectionSchema } from "../Models/Validations/CollectionSchema.js";

const router = express.Router();

router.post(
  "/",
  verifySchema(collectionSchema),
  auth.authenticateToken,
  createCollectionC,
);

router.get("/", getCollectionsC);

router.put(
  "/key/:key",
  verifySchema(updateCollectionSchema),
  auth.authenticateToken,
  updateCollectionC,
);

router.get("/key/:key", getCollectionByKeyC);

router.delete("/key/:key", auth.authenticateToken, deleteCollectionC);

router.delete("/collectionitem/:id", auth.authenticateToken, deleteCollectionItemC);

export default router;
