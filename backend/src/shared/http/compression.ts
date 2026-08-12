import compression from "compression";

import { env } from "../config/env";

export const compressionMiddleware = compression({
  threshold: env.COMPRESSION_THRESHOLD,
});
