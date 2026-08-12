import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export function requestId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = req.header("X-Request-ID") ?? randomUUID();
  req.requestId = id;
  res.setHeader("X-Request-ID", id);
  next();
}
