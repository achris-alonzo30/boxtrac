import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email()
    .includes("@"),
});

export const newPasswordSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .min(6, "Code must be at least 6 characters")
    .max(6, "Code must be less than 6 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
