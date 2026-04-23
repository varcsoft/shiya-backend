import z from "zod";

const imageSchema = z
  .object({
    productId: z.uuidv7().optional(),
    productVariantId: z.uuidv7().optional(),
    categoryId: z.uuidv7().optional(),
    subcategoryId: z.uuidv7().optional(),
    url: z.url("Invalid image URL"),
    blurHash: z.string().optional(),
  })
  .strict();

export { imageSchema };
