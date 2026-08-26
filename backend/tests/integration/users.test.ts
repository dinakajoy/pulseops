import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";

describe("User API", () => {
  describe("POST /api/v1/users", () => {
    it("creates a user", async () => {
      const response = await request(app).post("/api/v1/users").send({
        name: "Tester Joy",
        email: "testerjoy@test.com",
        password: "f5ghyu#jj7nf",
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        data: {
          name: "Tester Joy",
          email: "testerjoy@test.com",
          status: "active",
        },
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it("rejects a user with an invalid request body", async () => {
      const response = await request(app).post("/api/v1/users").send({
        name: "",
      });
      expect(response.status).toBe(400);
    });

    it("rejects duplicate emails", async () => {
      await request(app).post("/api/v1/users").send({
        name: "New User",
        email: "newuser@test.com",
        password: "f5ghyu#jj7nf",
      });
      const response = await request(app).post("/api/v1/users").send({
        name: "New User",
        email: "newuser@test.com",
        password: "f5ghyu#jj7nf",
      });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: {
          code: "EMAIL_ALREADY_EXISTS",
        },
      });
    });
  });
});
