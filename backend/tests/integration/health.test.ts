import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("HTTP middleware pipeline", () => {
  describe("request ID", () => {
    it("generates a request ID", async () => {
      const response = await request(app).get("/api/v1/health").expect(200);

      expect(response.headers["x-request-id"]).toBeDefined();
      expect(response.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
    });

    it("preserves an existing request ID", async () => {
      const response = await request(app)
        .get("/api/v1/health")
        .set("X-Request-ID", "test-request-123")
        .expect(200);

      expect(response.headers["x-request-id"]).toBe("test-request-123");
    });
  });

  describe("security headers", () => {
    it("adds security headers", async () => {
      const response = await request(app).get("/api/v1/health").expect(200);

      expect(response.headers["x-content-type-options"]).toBe("nosniff");

      expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    });

    it("does not expose the Express server", async () => {
      const response = await request(app).get("/api/v1/health").expect(200);

      expect(response.headers["x-powered-by"]).toBeUndefined();
    });
  });

  describe("CORS", () => {
    it("allows the configured origin", async () => {
      const response = await request(app)
        .get("/api/v1/health")
        .set("Origin", "http://localhost:3001")
        .expect(200);

      expect(response.headers["access-control-allow-origin"]).toBe(
        "http://localhost:3001",
      );
    });
  });

  describe("routing", () => {
    it("returns 404 for an unknown route", async () => {
      const response = await request(app).get("/does-not-exist").expect(404);

      expect(response.body).toMatchObject({
        error: {
          code: "NOT_FOUND",
          message: "Route GET /does-not-exist not found",
        },
      });

      expect(response.body.error.requestId).toBeDefined();
    });
  });

  describe("health", () => {
    it("returns a healthy response", async () => {
      const response = await request(app).get("/api/v1/health").expect(200);

      expect(response.body).toEqual({
        status: "ok",
        service: "pulseops-api",
      });
    });
    it("returns a healthy response for database connection", async () => {
      const response = await request(app)
        .get("/api/v1/health/ready")
        .expect(200);

      expect(response.body).toEqual({
        status: "ready",
        database: "connected",
      });
    });
  });
});
