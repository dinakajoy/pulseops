import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),

  roleId: z.uuid("Invalid role ID").optional(),
});

export const updateInvitationSchema = z.object({
  email: z.string().trim().email("Invalid email address").optional(),

  roleId: z.uuid("Invalid role ID").optional(),

  status: z.enum(["pending", "accepted", "revoked"]).optional(),
});

export const invitationIdSchema = z.uuid();
