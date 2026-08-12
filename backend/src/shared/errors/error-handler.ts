import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { logger } from "../config/logger";
import { AppError } from "./app-error";

export const errorHandler: ErrorRequestHandler = (error, req, res) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten(),
        requestId: req.requestId,
      },
    });

    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined && {
          details: error.details,
        }),
        requestId: req.requestId,
      },
    });

    return;
  }

  logger.error(
    {
      err: error,
      requestId: req.requestId,
    },
    "Unhandled application error",
  );

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      requestId: req.requestId,
    },
  });
};
