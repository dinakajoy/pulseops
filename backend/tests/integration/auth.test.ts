import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app";
import { pool } from "../../src/shared/database/pool";

describe("Auth API", () => {
  let organizationId: string;
  let roleId: string;

  beforeAll(async () => {
    const organization = await request(app).post("/api/v1/organizations").send({
      name: "Acme Company",
      ownerEmail: "acmeadmin@test.com",
    });
    organizationId = organization.body.data.id;

    const roles = await pool.query(`SELECT * FROM roles WHERE name = $1`, [
      "ADMIN",
    ]);
    roleId = roles.rows[0].id;
  });

  describe("POST /api/v1/organizations/${organizationId}/auth/register", () => {
    it("creates a user", async () => {
      const invitation = await request(app).post(`/api/v1/invitations`).send({
        email: "testerjoy@test.com",
        roleId,
        organizationId,
      });

      await request(app).post(
        `/api/v1/organizations/${organizationId}/invitations/accept/${invitation.body.data.token}`,
      );

      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/auth/register`)
        .send({
          name: "Tester Joy",
          email: "testerjoy@test.com",
          password: "F5ghyu#jj7nf",
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
      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/auth/register`)
        .send({
          name: "",
        });
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    });

    it("rejects weak password", async () => {
      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/auth/register`)
        .send({
          name: "New User2",
          email: "newuser2@test.com",
          password: "pass",
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    });

    it("rejects duplicate emails", async () => {
      const invitation = await request(app).post(`/api/v1/invitations`).send({
        email: "newuser@test.com",
        roleId,
        organizationId,
      });

      await request(app).post(
        `/api/v1/organizations/${organizationId}/invitations/accept/${invitation.body.data.token}`,
      );
      await request(app)
        .post(`/api/v1/organizations/${organizationId}/auth/register`)
        .send({
          name: "New User",
          email: "newuser@test.com",
          password: "F5ghyu#jj7nf",
        });
      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/auth/register`)
        .send({
          name: "New User",
          email: "newuser@test.com",
          password: "F5ghyu#jj7nf",
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
