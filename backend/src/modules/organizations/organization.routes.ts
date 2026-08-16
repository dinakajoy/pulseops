import { Router } from "express";

import { pool } from "../../shared/database/pool";
import { validateBody } from "../../shared/http/validate";

import {
  createOrganizationSchema,
  updateOrganizationSchema,
  updateOrganizationStatusSchema,
} from "./organization.schema";

import { PostgresOrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";

const organizationRouter = Router();

const repository = new PostgresOrganizationRepository(pool);

const service = new OrganizationService(repository);

const controller = new OrganizationController(service);

organizationRouter.post(
  "/organizations",
  validateBody(createOrganizationSchema),
  controller.create,
);

organizationRouter.get("/organizations/:id", controller.getById);

organizationRouter.patch(
  "/organizations/:id",
  validateBody(updateOrganizationSchema),
  controller.update,
);

organizationRouter.patch(
  "/organizations/:id/status",
  validateBody(updateOrganizationStatusSchema),
  controller.updateStatus,
);

export default organizationRouter;
