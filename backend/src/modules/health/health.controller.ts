import type { Request, Response } from "express";

import { pool } from "../../shared/database/pool.js";

export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({
    status: "ok",
    service: "pulseops-api",
  });
}

export async function getReadiness(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ready",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "not_ready",
      database: "unavailable",
    });
  }
}
