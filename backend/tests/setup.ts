import { beforeAll, afterAll } from "vitest";
import { pool } from "../src/shared/database/pool";

beforeAll(async () => {
  await pool.query("SELECT 1");
});

afterAll(async () => {
  await pool.query(`
    TRUNCATE TABLE
      invitations
    CASCADE
  `);
  await pool.query(`
    TRUNCATE TABLE
      organizations
    CASCADE
  `);
  await pool.end();
});
