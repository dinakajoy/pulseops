import { Server } from "node:http";
import app from "./app";

import { env } from "./shared/config/env";
import { logger } from "./shared/config/logger";

import { checkDatabaseConnection, pool } from "./shared/database/pool";

let server: Server;

async function startServer(): Promise<void> {
  try {
    await checkDatabaseConnection();

    server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "PulseOps API started",
      );
    });

    server.on("error", (error) => {
      logger.fatal(
        {
          err: error,
        },
        "HTTP server failed",
      );

      process.exit(1);
    });
  } catch (error) {
    logger.fatal(
      {
        err: error,
      },
      "Failed to start PulseOps API",
    );

    await pool.end();

    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "Shutdown signal received");

  if (!server) {
    await pool.end();

    process.exit(0);
  }

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

void startServer();
