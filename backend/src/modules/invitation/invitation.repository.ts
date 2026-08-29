import { Pool } from "pg";
import {
  CreateInvitationInput,
  Invitation,
  Invite,
  InvitationRepository,
  InvitationStatus,
  ResendInvitationInput,
  UpdateInvitationInput,
} from "./invitation.types";

type InvitationRow = {
  id: string;
  email: string;
  role_id: string;
  status: InvitationStatus;
  expires_at: Date;
  accepted_at: Date;
  created_at: Date;
};

function mapInvitation(row: InvitationRow): Invitation {
  return {
    id: row.id,
    email: row.email,
    roleId: row.role_id,
    status: row.status,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
  };
}

export class PostgresInvitationRepository implements InvitationRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CreateInvitationInput): Promise<Invitation> {
    const result = await this.db.query(
      `
      INSERT INTO invitations (
        organization_id,
        email,
        role_id,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        email,
        role_id,
        status,
        expires_at,
        accepted_at,
        created_at
      `,
      [
        input.organizationId,
        input.email,
        input.roleId,
        input.tokenHash,
        input.expiresAt,
      ],
    );

    return mapInvitation(result.rows[0]);
  }
  // TODO: Ensure all finds, update and delete uses organization_id as part of the WHERE clause

  async findByOrganizationEmailStatus(
    organizationId: string,
    email: string,
    status: string,
  ): Promise<Invitation | null> {
    const result = await this.db.query(
      `
    SELECT
      id,
      organization_id,
      email,
      role_id
    FROM invitations
    WHERE organization_id = $1
      AND email = $2
      AND status = $3
    LIMIT 1
    `,
      [organizationId, email, status],
    );

    return result.rows[0] ? mapInvitation(result.rows[0]) : null;
  }

  async findByTokenHashAndOrganization(
    organizationId: string,
    tokenHash: string,
  ): Promise<Invite | null> {
    const result = await this.db.query(
      `
    SELECT
      id,
      organization_id,
      email,
      role_id,
      status,
      token_hash,
      expires_at,
      accepted_at,
      created_at,
      updated_at
    FROM invitations
    WHERE token_hash = $1
      AND organization_id = $2
    LIMIT 1
    `,
      [tokenHash, organizationId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findAll(): Promise<Invitation[]> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at,
        accepted_at,
        created_at
      FROM invitations
      WHERE organization_id = $1
      `,
      [],
    );

    return result.rows.map(mapInvitation);
  }

  async findById(id: string): Promise<Invitation | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at,
        accepted_at,
        created_at
      FROM invitations
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapInvitation(result.rows[0]);
  }

  async findByIdAndEmail(
    id: string,
    email: string,
  ): Promise<Invitation | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at,
        accepted_at,
        created_at
      FROM invitations
      WHERE email = $1
        AND id = $2
      `,
      [email, id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapInvitation(result.rows[0]);
  }

  async update(id: string, input: UpdateInvitationInput): Promise<Invitation> {
    const result = await this.db.query(
      `
      UPDATE invitations
      SET
        role_id = COALESCE($2, role_id),
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        email,
        role_id,
        status,
        expires_at,
        accepted_at,
        created_at
      `,
      [id, input.roleId ?? null, input.status ?? null],
    );

    return mapInvitation(result.rows[0]);
  }

  async resend(id: string, input: ResendInvitationInput): Promise<Invitation> {
    const result = await this.db.query(
      `
      UPDATE invitations
      SET
        token_hash = $3,
        expires_at = $4,
        status = 'pending',
        updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
      RETURNING
        id,
        email,
        role_id,
        status,
        expires_at,
        accepted_at,
        created_at
      `,
      [id, "", input.tokenHash, input.expiresAt],
    );

    return mapInvitation(result.rows[0]);
  }

  async accept(id: string): Promise<Invitation | null> {
    const result = await this.db.query(
      `
    UPDATE invitations
    SET
      status = 'accepted',
      accepted_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
      AND status = 'pending'
    RETURNING
      id,
      organization_id,
      email,
      role_id,
      status,
      expires_at,
      accepted_at,
      created_at,
      updated_at
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapInvitation(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query(
      `
      DELETE FROM invitations
      WHERE id = $1 AND organization_id = $2
      `,
      [id],
    );
  }
}
