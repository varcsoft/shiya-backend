import z from "zod";
import { imageSchema } from "./ImageSchema.js";

const faqSchema = z
  .object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    status: z.boolean().default(true),
  })
  .strict();

export { faqSchema };
