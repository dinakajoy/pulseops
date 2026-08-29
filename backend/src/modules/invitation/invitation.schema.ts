import { z } from "zod";

export const createInvitationSchema = z.object({
  organizationId: z.uuid("Invalid organization ID"), // To be removed after authentication
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value: string) => value.toLowerCase()),

  roleId: z.uuid("Invalid role ID"),
});

export const updateInvitationSchema = z.object({
  roleId: z.uuid("Invalid role ID").optional(),

  status: z.enum(["pending", "accepted", "revoked"]).optional(),
});
