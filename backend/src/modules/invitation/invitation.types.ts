// export type InvitationStatus = "pending" | "accepted" | "revoked";
export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Invitation {
  id: string;
  // organizationId: string;
  email: string;
  roleId: string;
  // token: string;
  status: InvitationStatus;
  expiresAt: Date;
  // acceptedAt: Date | null;
  // createdBy: string | null;
  // createdAt: Date;
  // updatedAt: Date;
}

export interface CreateInvitationInput {
  organizationId: string;
  email: string;
  roleId: string;
  tokenHash: string;
  expiresAt: Date;
  // createdBy: string | null;
}

export interface UpdateInvitationInput {
  email?: string;
  roleId?: string;
  status?: InvitationStatus;
}

export interface InvitationRepository {
  create(input: CreateInvitationInput): Promise<Invitation>;

  findAll(organizationId: string): Promise<Invitation[]>;

  findById(id: string, organizationId: string): Promise<Invitation | null>;

  findByTokenHash(
    tokenHash: string,
    organizationId: string,
  ): Promise<Invitation | null>;

  findByEmail(
    email: string,
    organizationId: string,
  ): Promise<Invitation | null>;

  update(
    id: string,
    organizationId: string,
    input: UpdateInvitationInput,
  ): Promise<Invitation>;

  delete(id: string, organizationId: string): Promise<void>;
}
