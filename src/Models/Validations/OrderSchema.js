import pkg from "@prisma/client";
const { OrderStatus } = pkg;
import z from "zod";

const orderSchema = z
  .object({
    products: z
      .array(
        z.object({
          productId: z.uuidv7("Product ID is required"),
          variantId: z.uuidv7("Variant ID is required").optional(),
          quantity: z
            .number("Quantity is required")
            .min(1, "Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one product is required"),
    addressId: z.uuidv7("Address ID is required"),
  })
  .strict();
  
const orderFromCartSchema = z
  .object({
    addressId: z.uuidv7("Address ID is required"),
  })
  .strict();

const orderStatusSchema = z
  .object({
    orderStatus: z.enum(OrderStatus, "Order status is required"),
  })
  .strict();

export { orderSchema, orderStatusSchema, orderFromCartSchema };
