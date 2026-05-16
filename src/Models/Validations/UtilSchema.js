import z from "zod";

const pinCodeSchema = z
  .object({
    pinCode: z.string().min(1).max(6),
  })
  .strict();

export { pinCodeSchema };
