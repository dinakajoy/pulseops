import { Pool } from "pg";

import { env } from "../config/env";
import { logger } from "../config/logger";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (error) => {
  logger.error(
    {
      err: error,
    },
    "Unexpected PostgreSQL pool error",
  );
});

export async function checkDatabaseConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");

    logger.info("PostgreSQL connection established");
  } finally {
    client.release();
  }
}
