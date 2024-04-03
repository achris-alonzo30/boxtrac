import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First Name must be at least 1 characters")
    .max(50, "First Name must be less than 32 characters"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last Name must be at least 1 characters")
    .max(50, "Last Name must be less than 32 characters"),
  emailAddress: z
    .string({ required_error: "Email is required" })
    .email()
    .includes("@"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const loginSchema = z.object({
  emailAddress: z
    .string({ required_error: "Email is required" })
    .email()
    .includes("@"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const verifyAccountSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .min(6, "Code must be at least 6 characters")
    .max(6, "Code must be less than 6 characters"),
})