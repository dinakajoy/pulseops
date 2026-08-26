import { Pool } from "pg";
import {
  CreateUserInput,
  User,
  UserRepository,
  UserStatus,
} from "./users.types";

type UserRow = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    status: row.status,
    passwordHash: row.password_hash || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly db: Pool) {}

  async create(input: CreateUserInput): Promise<User> {
    const result = await this.db.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        status,
        created_at,
        updated_at
      `,
      [input.name, input.email, input.password],
    );

    return mapUser(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        name,
        email,
        status,
        password_hash,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
      `,
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapUser(result.rows[0]);
  }
}
