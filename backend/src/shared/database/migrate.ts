import fs from "node:fs/promises";
import path from "node:path";

import { pool } from "./pool";
import { logger } from "../config/logger";

const __filename = path.join(process.cwd(), "src/shared/database/migrations");
const __dirname = path.dirname(__filename);

const migrationsDirectory = path.resolve(__dirname, "./migrations");

async function migrate(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const files = await fs.readdir(migrationsDirectory);

    const migrations = files.filter((file) => file.endsWith(".sql")).sort();

    for (const migration of migrations) {
      const alreadyApplied = await client.query(
        `
        SELECT 1
        FROM schema_migrations
        WHERE version = $1
        `,
        [migration],
      );

      if (alreadyApplied.rowCount !== 0) {
        continue;
      }

      logger.info({ migration }, "Running migration");

      const sql = await fs.readFile(
        path.join(migrationsDirectory, migration),
        "utf8",
      );

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
          INSERT INTO schema_migrations (version)
          VALUES ($1)
          `,
          [migration],
        );

        await client.query("COMMIT");

        logger.info({ migration }, "Migration completed");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    logger.info("Database migrations completed");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  logger.fatal(
    {
      err: error,
    },
    "Database migration failed",
  );

  process.exit(1);
});
