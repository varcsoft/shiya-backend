import z from "zod";

const cartSchema = z
  .object({
    productId: z.uuidv7(),
    productVariantId: z.uuidv7().optional(),
    quantity: z.number().int().min(1, "Quantity is required"),
  })
  .strict();

const updateCartSchema = z
  .object({
    quantity: z.number().int().min(1, "Quantity is required"),
  })
  .strict();

export { cartSchema, updateCartSchema };
