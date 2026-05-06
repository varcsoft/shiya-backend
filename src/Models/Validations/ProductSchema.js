import pkg from "@prisma/client";
const { QuantityType } = pkg;
import z from "zod";
import { imageSchema } from "./ImageSchema.js";

const specificationsSchema = z
  .array(
    z.object({
      id: z.uuidv7().optional(),
      deleted: z.boolean().optional().default(false),
      label: z.string().optional(),
      value: z.string().optional(),
      superSpecificationId: z.string().optional(),
      sort: z.number().optional().nullable(),
    }),
  )
  .optional();

const variantSchema = z
  .object({
    label: z.string().optional(),
    quantityType: z.enum(QuantityType, "Invalid quantity type"),
    rating: z
      .number()
      .min(0, "Rating must be non-negative")
      .max(5, "Rating must be less than or equal to 5"),
    price: z.number().min(0, "Price must be non-negative"),
    stock: z.number().min(0, "Stock quantity must be non-negative"),
    offerPrice: z
      .number()
      .min(0, "Offer price must be non-negative")
      .optional(),
    specifications: specificationsSchema,
    enableOffer: z.boolean().optional().default(false),
    images: z.array(imageSchema).min(0, "At least one image is required").optional().nullable(),
  })
  .strict();

const variantStandaloneSchema = z
  .object({
    productId: z.uuidv7(),
    label: z.string().optional(),
    quantityType: z.enum(QuantityType, "Invalid quantity type"),
    rating: z
      .number()
      .min(0, "Rating must be non-negative")
      .max(5, "Rating must be less than or equal to 5"),
    price: z.number().min(0, "Price must be non-negative"),
    stock: z.number().min(0, "Stock quantity must be non-negative"),
    offerPrice: z
      .number()
      .min(0, "Offer price must be non-negative")
      .optional(),
    specifications: specificationsSchema,
    enableOffer: z.boolean().default(false),
    images: z
      .array(imageSchema)
      .min(0, "At least one image is required")
      .optional()
      .nullable(),
  })
  .strict();

const updateVariantStandaloneSchema = z
  .object({
    productId: z.uuidv7(),
    label: z.string().optional(),
    rating: z
      .number()
      .min(0, "Rating must be non-negative")
      .max(5, "Rating must be less than or equal to 5"),
    price: z.number().min(0, "Price must be non-negative"),
    images: z
      .array(imageSchema)
      .min(1, "At least one image is required")
      .optional()
      .nullable(),
    quantityType: z.enum(QuantityType, "Invalid quantity type"),
    offerPrice: z
      .number()
      .min(0, "Offer price must be non-negative")
      .optional(),
    deleted: z.boolean().default(false),
    specifications: specificationsSchema,
    enableOffer: z.boolean().default(false),
    stock: z.number().min(0, "Stock quantity must be non-negative"),
  })
  .strict();

const productSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    rating: z
      .number()
      .min(0, "Rating must be non-negative")
      .max(5, "Rating must be less than or equal to 5"),
    price: z.number().min(0, "Price must be non-negative"),
    images: z.array(imageSchema).min(1, "At least one image is required"),
    deleted: z.boolean().default(false),
    details: z.array(z.string()).optional().nullable(),
    offerPrice: z
      .number()
      .min(0, "Offer price must be non-negative")
      .optional(),
    enableOffer: z.boolean().default(false),
    specifications: specificationsSchema,
    stock: z.number().min(0, "Stock quantity must be non-negative"),
    quantityType: z.enum(QuantityType, "Invalid quantity type"),
    categoryId: z.uuidv7().optional(),
    subcategoryId: z.uuidv7().optional(),
    productVariants: z.array(variantSchema).optional(),
  })
  .strict();

const updateProductSchema = productSchema
  .omit({
    productVariants: true,
  })
  .strict()
  .partial();

export {
  productSchema,
  variantSchema,
  updateProductSchema,
  variantStandaloneSchema,
  updateVariantStandaloneSchema,
};
