import { beforeAll, afterAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app";
import { pool } from "../../src/shared/database/pool";

describe("Organization API", () => {
  beforeAll(async () => {
    await pool.query("SELECT 1");
  });

  afterAll(async () => {
    await pool.query("TRUNCATE TABLE organizations CASCADE");
    await pool.end();
  });

  describe("POST /api/v1/organizations", () => {
    it("creates an organization", async () => {
      const response = await request(app).post("/api/v1/organizations").send({
        name: "Acme Corporation",
      });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        data: {
          name: "Acme Corporation",
          slug: "acme-corporation",
          status: "active",
        },
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it("rejects an organization with an invalid request body", async () => {
      const response = await request(app).post("/api/v1/organizations").send({
        name: "",
      });
      expect(response.status).toBe(400);
    });

    it("rejects duplicate slugs", async () => {
      await request(app).post("/api/v1/organizations").send({
        name: "New Acme Corporation",
      });
      const response = await request(app).post("/api/v1/organizations").send({
        name: "Acme Corporation",
        slug: "new-acme-corporation",
      });
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: {
          code: "ORGANIZATION_SLUG_ALREADY_EXISTS",
        },
      });
    });
  });

  describe("GET /api/v1/organizations/:id", () => {
    it("returns an organization", async () => {
      const createResponse = await request(app)
        .post("/api/v1/organizations")
        .send({
          name: "Get Test Organization",
        });
      expect(createResponse.status).toBe(201);
      const organizationId = createResponse.body.data.id;
      const response = await request(app).get(
        `/api/v1/organizations/${organizationId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        data: {
          id: organizationId,
          name: "Get Test Organization",
          slug: "get-test-organization",
          status: "active",
        },
      });
    });

    it("returns an organization by slug", async () => {
      const createResponse = await request(app)
        .post("/api/v1/organizations")
        .send({
          name: "Get Test Org",
        });
      expect(createResponse.status).toBe(201);
      const organizationId = createResponse.body.data.id;
      const organizationSlug = createResponse.body.data.slug;

      const response = await request(app).get(
        `/api/v1/organizations/slug/${organizationSlug}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        data: {
          id: organizationId,
          name: "Get Test Org",
          slug: organizationSlug,
          status: "active",
        },
      });
    });

    it("returns 404 when the organization does not exist", async () => {
      const response = await request(app).get(
        "/api/v1/organizations/8276777d-bde7-4215-bf9d-b315f07c995f",
      );
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: {
          code: "ORGANIZATION_NOT_FOUND",
        },
      });
    });
  });

  describe("PATCH /api/v1/organizations/:id", () => {
    it("updates an organization", async () => {
      const createResponse = await request(app)
        .post("/api/v1/organizations")
        .send({
          name: "Original Organization",
        });

      expect(createResponse.status).toBe(201);

      const organizationId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/v1/organizations/${organizationId}`)
        .send({
          name: "Updated Organization",
        });

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        data: {
          id: organizationId,
          name: "Updated Organization",
        },
      });
    });
  });

  describe("PATCH /api/v1/organizations/:id/status", () => {
    it("updates an organization's status", async () => {
      const createResponse = await request(app)
        .post("/api/v1/organizations")
        .send({
          name: "Status Test Organization",
        });

      expect(createResponse.status).toBe(201);

      const organizationId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/v1/organizations/${organizationId}/status`)
        .send({
          status: "suspended",
        });

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        data: {
          id: organizationId,
          status: "suspended",
        },
      });
    });
  });
});
