import z from "zod";

const shipmentSchema = z
  .object({
    pinCode: z.string().min(1).max(6),
    waybillNumber: z.string().min(1).max(100).optional(),
    referenceIds: z.array(z.string()).min(1).max(100).optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    length: z.number().optional(),
    weight: z.number().optional(),
  })
  .strict();

const updateShipmentSchema = shipmentSchema.omit({
  pinCode: true,
});


export { shipmentSchema, updateShipmentSchema };
