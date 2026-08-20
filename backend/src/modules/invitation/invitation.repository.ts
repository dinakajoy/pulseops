import { Pool } from "pg";
import {
  CreateInvitationInput,
  Invitation,
  InvitationRepository,
  InvitationStatus,
  UpdateInvitationInput,
} from "./invitation.types";

type InvitationRow = {
  id: string;
  organization_id: string;
  email: string;
  role_id: string;
  // token_hash: string;
  status: InvitationStatus;
  expires_at: Date;
  // accepted_at: Date;
  // created_at: Date;
  // updated_at: Date;
};

function mapInvitation(row: InvitationRow): Invitation {
  return {
    id: row.id,
    // organizationId: row.organization_id,
    email: row.email,
    roleId: row.role_id,
    // token: row.token_hash,
    status: row.status,
    expiresAt: row.expires_at,
    // acceptedAt: row.accepted_at,
    // createdAt: row.created_at,
    // updatedAt: row.updated_at,
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
        expires_at
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

  async findAll(organizationId: string): Promise<Invitation[]> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at
      FROM invitations
      WHERE organization_id = $1
      `,
      [organizationId],
    );

    return result.rows.map(mapInvitation);
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<Invitation | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at
      FROM invitations
      WHERE id = $1 AND organization_id = $2
      `,
      [id, organizationId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapInvitation(result.rows[0]);
  }

  async findByTokenHash(
    tokenHash: string,
    organizationId: string,
  ): Promise<Invitation | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at
      FROM invitations
      WHERE token_hash = $1 AND organization_id = $2
      `,
      [tokenHash, organizationId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapInvitation(result.rows[0]);
  }

  async findByEmail(
    email: string,
    organizationId: string,
  ): Promise<Invitation | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        email,
        role_id,
        status,
        expires_at
      FROM invitations
      WHERE email = $1 AND organization_id = $2
      `,
      [email, organizationId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapInvitation(result.rows[0]);
  }

  async update(
    id: string,
    organizationId: string,
    input: UpdateInvitationInput,
  ): Promise<Invitation> {
    const result = await this.db.query(
      `
      UPDATE invitations
      SET
        email = COALESCE($3, email),
        role_id = COALESCE($4, role_id),
        status = COALESCE($5, status),
        updated_at = NOW()
      WHERE id = $1 AND organization_id = $2
      RETURNING
        id,
        email,
        role_id,
        status,
        expires_at
      `,
      [
        id,
        organizationId,
        input.email ?? null,
        input.roleId ?? null,
        input.status ?? null,
      ],
    );

    return mapInvitation(result.rows[0]);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.db.query(
      `
      DELETE FROM invitations
      WHERE id = $1 AND organization_id = $2
      `,
      [id, organizationId],
    );
  }
}
