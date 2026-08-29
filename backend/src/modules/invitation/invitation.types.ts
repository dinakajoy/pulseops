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

export interface Invite extends Invitation {
  organization_id: string;
  expires_at: Date;
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

  findByTokenHashAndOrganization(
    organizationId: string,
    tokenHash: string,
  ): Promise<Invite | null>;

  findByOrganizationEmailStatus(
    organizationId: string,
    email: string,
    status: string,
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
