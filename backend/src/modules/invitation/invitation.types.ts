export type InvitationStatus = "pending" | "accepted" | "revoked";

export interface Invitation {
  id: string;
  email: string;
  roleId: string;
  status: InvitationStatus;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
  token?: string;
}

export interface CreateInvitationInput {
  organizationId: string;
  email: string;
  roleId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface UpdateInvitationInput {
  email?: string;
  roleId?: string;
  status?: InvitationStatus;
}

export interface ResendInvitationInput {
  tokenHash: string;
  expiresAt: Date;
}

export interface InvitationRepository {
  create(input: CreateInvitationInput): Promise<Invitation>;

  findAll(): Promise<Invitation[]>;

  findById(id: string): Promise<Invitation | null>;

  findByTokenHash(
    tokenHash: string,
    // organizationId: string,
  ): Promise<Invitation | null>;

  findPendingByOrganizationAndEmail(
    organizationId: string,
    email: string,
  ): Promise<Invitation | null>;

  update(
    id: string,
    // organizationId: string,
    input: UpdateInvitationInput,
  ): Promise<Invitation>;

  resend(id: string, input: ResendInvitationInput): Promise<Invitation>;

  accept(id: string): Promise<Invitation | null>;

  delete(id: string): Promise<void>;
}
