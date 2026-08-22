import { createHash, randomBytes } from "node:crypto";

import {
  InvitationNotFoundError,
  InvitationExistsError,
  InvitationAcceptedError,
  InvitationExpiredError,
  InvitationRevokedError,
} from "./invitation.errors";

import {
  Invitation,
  InvitationRepository,
  UpdateInvitationInput,
} from "./invitation.types";

type CreateInvitationInput = {
  organizationId: string;
  email: string;
  roleId: string;
};

const INVITATION_EXPIRY_DAYS = 7;

export class InvitationService {
  constructor(private readonly repository: InvitationRepository) {}

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  async create(input: CreateInvitationInput): Promise<Invitation> {
    const existing = await this.repository.findPendingByOrganizationAndEmail(
      input.organizationId,
      input.email,
    );

    if (existing) {
      throw new InvitationExistsError();
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    // TODO: Send invitation email with the 'token' not 'tokenHash'

    const result = await this.repository.create({
      organizationId: input.organizationId,
      email: input.email,
      roleId: input.roleId,
      tokenHash,
      expiresAt,
    });

    return { ...result, token };
  }

  async getAll(): Promise<Invitation[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Invitation> {
    const invitation = await this.repository.findById(id);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    return invitation;
  }

  async update(id: string, input: UpdateInvitationInput): Promise<Invitation> {
    const invitation = await this.repository.findById(id);
    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status === "accepted") {
      throw new InvitationAcceptedError();
    }

    if (invitation.status === "revoked") {
      throw new InvitationRevokedError();
    }

    if (new Date() > invitation.expiresAt) {
      throw new InvitationExpiredError();
    }

    const updates: UpdateInvitationInput = {};

    if (input.roleId !== undefined) {
      updates.roleId = input.roleId;
    }

    if (input.status !== undefined) {
      updates.status = input.status;
    }

    return this.repository.update(id, updates);
  }

  async resend(id: string): Promise<Invitation> {
    const invitation = await this.repository.findById(id);
    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status === "accepted") {
      throw new InvitationAcceptedError();
    }

    if (invitation.status === "revoked") {
      throw new InvitationRevokedError();
    }

    if (invitation.status === "pending" && new Date() < invitation.expiresAt) {
      throw new InvitationExistsError();
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    // TODO: Send re-invitation email with the 'token' not 'tokenHash'

    return this.repository.resend(id, { tokenHash, expiresAt });
  }

  async accept(token: string): Promise<Invitation | null> {
    const tokenHash = this.hashToken(token);

    const invitation = await this.repository.findByTokenHash(tokenHash);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status === "accepted") {
      throw new InvitationAcceptedError();
    }

    if (invitation.status === "revoked") {
      throw new InvitationRevokedError();
    }

    if (new Date() > invitation.expiresAt) {
      throw new InvitationExpiredError();
    }

    return this.repository.accept(invitation.id);
  }

  async delete(id: string): Promise<void> {
    const invitation = await this.repository.findById(id);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    await this.repository.delete(id);
  }
}
