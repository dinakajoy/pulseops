import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app";
import { pool } from "../../src/shared/database/pool";

describe("Invitation API", () => {
  let organizationId: string;
  let roleId: string;

  beforeAll(async () => {
    const organization = await request(app).post("/api/v1/organizations").send({
      name: "Acme Corps",
      ownerEmail: "acmecorpsadmin@test.com",
    });
    organizationId = organization.body.data.id;

    const roles = await pool.query(`SELECT * FROM roles WHERE name = $1`, [
      "ADMIN",
    ]);
    roleId = roles.rows[0].id;
  });

  describe("POST /api/v1/invitations", () => {
    it("creates an invitation", async () => {
      const response = await request(app).post("/api/v1/invitations").send({
        email: "acmeadmin@test.com",
        roleId,
        organizationId,
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        data: {
          email: "acmeadmin@test.com",
          roleId,
          status: "pending",
        },
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.expiresAt).toBeDefined();
      expect(response.body.data.acceptedAt).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it("rejects duplicate invitation email", async () => {
      await request(app).post("/api/v1/invitations").send({
        email: "duplicate@example.com",
        roleId,
        organizationId,
      });

      const response = await request(app).post("/api/v1/invitations").send({
        email: "duplicate@example.com",
        roleId,
        organizationId,
      });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: {
          code: "INVITATION_EXISTS",
        },
      });
    });

    it("normalizes email", async () => {
      const response = await request(app).post("/api/v1/invitations").send({
        email: "  USER@Example.COM  ",
        roleId,
        organizationId,
      });

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        data: {
          email: "user@example.com",
        },
      });
    });
  });

  describe("GET /invitations/:id", () => {
    it("gets invitation by ID", async () => {
      const createResponse = await request(app)
        .post("/api/v1/invitations")
        .send({
          email: "get-by-id@example.com",
          roleId,
          organizationId,
        });

      const invitationId = createResponse.body.data.id;

      const response = await request(app).get(
        `/api/v1/invitations/${invitationId}`,
      );

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        data: {
          id: invitationId,
          email: "get-by-id@example.com",
          roleId,
          status: "pending",
        },
      });
    });

    it("returns 404 when the invitation does not exist", async () => {
      const response = await request(app).get(
        "/api/v1/invitations/3156777d-bde7-4215-bf9d-bf07c827995f",
      );
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: {
          code: "INVITATION_NOT_FOUND",
        },
      });
    });
  });

  describe("PATCH /invitations/:id", () => {
    it("revokes pending invitation", async () => {
      const createResponse = await request(app)
        .post("/api/v1/invitations")
        .send({
          email: "revoke@example.com",
          roleId,
          organizationId,
        });

      const invitationId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/v1/invitations/${invitationId}`)
        .send({
          status: "revoked",
        });

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        data: {
          id: invitationId,
          status: "revoked",
        },
      });
    });
  });

  describe("POST /invitations/accept/:token", () => {
    it("accepts valid invitation", async () => {
      const createResponse = await request(app)
        .post("/api/v1/invitations")
        .send({
          email: "accept@example.com",
          roleId,
          organizationId,
        });

      const response = await request(app).post(
        `/api/v1/invitations/accept/${createResponse.body.data.token}`,
      );

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        data: {
          email: "accept@example.com",
          status: "accepted",
        },
      });
    });

    it("rejects already accepted invitation", async () => {
      const createResponse = await request(app)
        .post("/api/v1/invitations")
        .send({
          email: "accepted@example.com",
          roleId,
          organizationId,
        });

      const token = createResponse.body.data.token;

      await request(app).post(`/api/v1/invitations/accept/${token}`);

      const response = await request(app).post(
        `/api/v1/invitations/accept/${token}`,
      );

      expect(response.status).toBe(409);

      expect(response.body).toMatchObject({
        error: {
          code: "INVITATION_ACCEPTED",
        },
      });
    });

    it("rejects revoked invitation", async () => {
      const createResponse = await request(app)
        .post("/api/v1/invitations")
        .send({
          email: "revoked@example.com",
          roleId,
          organizationId,
        });

      const invitationId = createResponse.body.data.id;
      const token = createResponse.body.data.token;

      await request(app).patch(`/api/v1/invitations/${invitationId}`).send({
        status: "revoked",
      });

      const response = await request(app).post(
        `/api/v1/invitations/accept/${token}`,
      );

      expect(response.status).toBe(410);

      expect(response.body).toMatchObject({
        error: {
          code: "INVITATION_REVOKED",
        },
      });
    });

    it("rejects expired invitation", async () => {
      const createResponse = await request(app)
        .post("/api/v1/invitations")
        .send({
          email: "expired@example.com",
          roleId,
          organizationId,
        });

      const invitationId = createResponse.body.data.id;
      const invitationToken = createResponse.body.data.token;

      await pool.query(
        `
          UPDATE invitations
          SET expires_at = NOW() - INTERVAL '1 day'
          WHERE id = $1
          `,
        [invitationId],
      );

      const response = await request(app).post(
        `/api/v1/invitations/accept/${invitationToken}`,
      );

      expect(response.status).toBe(410);

      expect(response.body).toMatchObject({
        error: {
          code: "INVITATION_EXPIRED",
        },
      });
    });
  });
});
