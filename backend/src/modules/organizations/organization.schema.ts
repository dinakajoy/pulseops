import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(255),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    )
    .optional(),

  ownerEmail: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value: string) => value.toLowerCase()),
});

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(255).optional(),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    )
    .optional(),

  ownerEmail: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value: string) => value.toLowerCase())
    .optional(),
});

export const updateOrganizationStatusSchema = z.object({
  status: z.enum(["active", "suspended", "archived"]),
});
