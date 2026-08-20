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
    const email = input.email.trim().toLowerCase();

    const existing = await this.repository.findByEmail(
      email,
      input.organizationId,
    );

    if (existing) {
      throw new InvitationExistsError();
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    return this.repository.create({
      organizationId: input.organizationId,
      email,
      roleId: input.roleId,
      tokenHash,
      expiresAt,
    });

    // return {
    //   ...invitation,
    //   token,
    // };
  }

  async getAll(organizationId: string): Promise<Invitation[]> {
    return this.repository.findAll(organizationId);
  }

  async getById(id: string, organizationId: string): Promise<Invitation> {
    const invitation = await this.repository.findById(id, organizationId);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    return invitation;
  }

  async getByTokenHash(
    tokenHash: string,
    organizationId: string,
  ): Promise<Invitation> {
    const invitation = await this.repository.findByTokenHash(
      tokenHash,
      organizationId,
    );

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    return invitation;
  }

  async updateById(
    id: string,
    organizationId: string,
    input: UpdateInvitationInput,
  ): Promise<Invitation> {
    const invitation = await this.repository.findById(id, organizationId);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (input.status) {
      if (invitation.status === "accepted") {
        throw new InvitationAcceptedError();
      }

      if (invitation.status === "revoked") {
        throw new InvitationRevokedError();
      }

      if (new Date() > invitation.expiresAt) {
        throw new InvitationExpiredError();
      }
    }

    return this.repository.update(id, organizationId, {
      email: input.email ? input.email.trim().toLowerCase() : invitation.email,
      roleId: input.roleId,
      status: input.status,
    });
  }

  async updateByToken(
    token: string,
    organizationId: string,
    input: UpdateInvitationInput,
  ): Promise<Invitation> {
    const tokenHash = this.hashToken(token);
    const invitation = await this.repository.findByTokenHash(
      tokenHash,
      organizationId,
    );

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (input.status) {
      if (invitation.status === "accepted") {
        throw new InvitationAcceptedError();
      }

      if (invitation.status === "revoked") {
        throw new InvitationRevokedError();
      }

      if (new Date() > invitation.expiresAt) {
        throw new InvitationExpiredError();
      }
    }

    return this.repository.update(invitation.id, organizationId, {
      email: input.email ? input.email.trim().toLowerCase() : invitation.email,
      roleId: input.roleId,
      status: input.status,
    });
  }

  async delete(id: string, organizationId: string): Promise<void> {
    const invitation = await this.repository.findById(id, organizationId);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    await this.repository.delete(id, organizationId);
  }
}
