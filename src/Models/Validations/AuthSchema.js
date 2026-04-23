import z from "zod";

const registerSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character")
      .regex(/^\S*$/, "Password cannot contain spaces"),
    firstName: z.string().min(1),
    lastName: z.string().min(1).optional(),
    countryCode: z.string().min(1),
    phone: z.string().min(10).optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
  })
  .strict();

const firebaseVerifySchema = z
  .object({
    idToken: z.string(),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    email: z.email(),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    oobCode: z.string(),
    password: z.string().min(6),
  })
  .strict();

const resetExistingPasswordSchema = z.object({
  existingPassword: z.string(),
  password: z.string().min(6),
});

export {
  registerSchema,
  loginSchema,
  firebaseVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resetExistingPasswordSchema,
};
