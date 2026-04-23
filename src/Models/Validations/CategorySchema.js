import z from "zod";
import { imageSchema } from "./ImageSchema.js";

const categorySchema = z
  .object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    images: z.array(imageSchema).optional(),
  })
  .strict();

const subCategorySchema = z
  .object({
    categoryId: z.uuidv7(),
    name: z.string().min(1, "Subcategory name is required"),
    description: z.string().optional(),
    images: z.array(imageSchema).optional(),
  })
  .strict();

export { categorySchema, subCategorySchema };
