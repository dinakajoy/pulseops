import { Pool } from "pg";
import {
  CreateOrganizationInput,
  Organization,
  OrganizationRepository,
  OrganizationStatus,
  UpdateOrganizationInput,
} from "./organization.types";

type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  owner_email: string;
  created_at: Date;
  updated_at: Date;
};

function mapOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    ownerEmail: row.owner_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class PostgresOrganizationRepository implements OrganizationRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const result = await this.db.query(
      `
      INSERT INTO organizations (
        name,
        slug,
        owner_email
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        slug,
        status,
        owner_email,
        created_at,
        updated_at
      `,
      [input.name, input.slug, input.ownerEmail],
    );

    return mapOrganization(result.rows[0]);
  }

  async findById(id: string): Promise<Organization | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        slug,
        status,
        owner_email,
        created_at,
        updated_at
      FROM organizations
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapOrganization(result.rows[0]);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        slug,
        status,
        owner_email,
        created_at,
        updated_at
      FROM organizations
      WHERE slug = $1
      `,
      [slug],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapOrganization(result.rows[0]);
  }

  async update(
    id: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization> {
    const result = await this.db.query(
      `
      UPDATE organizations
      SET
        name = COALESCE($2, name),
        slug = COALESCE($3, slug),
        owner_email = COALESCE($4, owner_email),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        name,
        slug,
        status,
        owner_email,
        created_at,
        updated_at
      `,
      [id, input.name ?? null, input.slug ?? null, input.ownerEmail ?? null],
    );

    return mapOrganization(result.rows[0]);
  }

  async updateStatus(
    id: string,
    status: OrganizationStatus,
  ): Promise<Organization> {
    const result = await this.db.query(
      `
      UPDATE organizations
      SET
        status = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        name,
        slug,
        status,
        owner_email,
        created_at,
        updated_at
      `,
      [id, status],
    );

    return mapOrganization(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query(
      `
      DELETE FROM organizations
      WHERE id = $1
      `,
      [id],
    );
  }
}
