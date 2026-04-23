import z from "zod";
import { imageSchema } from "./ImageSchema.js";
const productSchema = z.object({
  productId: z.uuidv7(),
});

const collectionSchema = z
  .object({
    name: z.string().min(1, "Collection name is required"),
    key: z.string().min(1, "Collection key is required"),
    collection_products: z.array(productSchema).optional(),
  })
  .strict();

const updateCollectionSchema = collectionSchema.omit({ key: true });

export { collectionSchema, updateCollectionSchema };
