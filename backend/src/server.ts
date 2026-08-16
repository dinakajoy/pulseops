import app from "./app";

import { env } from "./shared/config/env";
import { logger } from "./shared/config/logger";

import { pool } from "./shared/database/pool";

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      environment: env.NODE_ENV,
    },
    "PulseOps API started",
  );
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "Shutdown signal received");

  server.close(async () => {
    await pool.end();

    logger.info("PulseOps API shutdown complete");

    process.exit(0);
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
