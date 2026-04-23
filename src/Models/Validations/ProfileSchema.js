import pkg from '@prisma/client';
const { AddressType } = pkg;
import z from "zod";
//5 this should accept only the fields that are updatable
const updateProfileSchema = z
  .object({
    email: z.string().email().optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    countryCode: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    gender: z.enum(["MALE", "FEMALE", "NON-BINARY", "OTHER"]).optional(),
  })
  .strict();

const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6),
  })
  .strict();

const addressSchema = z
  .object({
    addressType: z.enum(AddressType),
    addressline1: z.string().min(1),
    addressline2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    pinCode: z.string().min(1),
  })
  .strict();

export { updateProfileSchema, updatePasswordSchema, addressSchema };
