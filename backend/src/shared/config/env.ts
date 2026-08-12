import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  // Database
  DATABASE_URL: z.string().min(1),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:3001"),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  // HTTP
  BODY_LIMIT: z.string().default("1mb"),

  URLENCODED_LIMIT: z.string().default("1mb"),

  // Compression
  COMPRESSION_ENABLED: z
    .string()
    .default("true")
    .transform((value) => value === "true"),

  COMPRESSION_THRESHOLD: z.string().default("1kb"),

  // Proxy
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  // Global rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),

  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),

  // Authentication rate limiting
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),

  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(result.error.flatten().fieldErrors);

  process.exit(1);
}

export const env = result.data;
