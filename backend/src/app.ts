import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { env } from "./shared/config/env";
import { logger } from "./shared/config/logger";

import { globalRateLimiter } from "./shared/http/rate-limit";
import { compressionMiddleware } from "./shared/http/compression";
import { requestId } from "./shared/http/request-id";
import { notFoundHandler } from "./shared/http/not-found";

import { errorHandler } from "./shared/errors/error-handler";

import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY);
app.use(requestId);

app.use(
  pinoHttp({
    logger,

    customProps: (req) => ({
      requestId: req.requestId,
    }),
  }),
);

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(globalRateLimiter);

if (env.COMPRESSION_ENABLED) {
  app.use(compressionMiddleware);
}

app.use(express.json({ limit: env.BODY_LIMIT }));

app.use(
  express.urlencoded({
    extended: true,
    limit: env.URLENCODED_LIMIT,
  }),
);

app.get("/", (_req, res) => {
  res.json({
    service: "pulseops-api",
    version: "1.0.0",
  });
});

app.use("/api/v1", routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
