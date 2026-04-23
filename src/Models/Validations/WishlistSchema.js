import z from "zod";

const wishlistSchema = z
  .object({
    productId: z.uuidv7(),
    productVariantId: z.uuidv7().optional().nullable(),
  })
  .strict();

export { wishlistSchema };
