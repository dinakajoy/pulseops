import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "User name must be at least 2 characters")
    .max(255),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value: string) => value.toLowerCase()),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});
