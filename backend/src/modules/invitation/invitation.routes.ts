import { Router } from "express";

import { pool } from "../../shared/database/pool";
import { validateBody } from "../../shared/http/validate";

import {
  createInvitationSchema,
  updateInvitationSchema,
} from "./invitation.schema";

import { PostgresInvitationRepository } from "./invitation.repository";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";

const organizationRouter = Router();

const repository = new PostgresInvitationRepository(pool);

const service = new InvitationService(repository);

const controller = new InvitationController(service);

organizationRouter.post(
  "/invitations",
  validateBody(createInvitationSchema),
  controller.create,
);

organizationRouter.get("/invitations", controller.getAll);

organizationRouter.get("/invitations/:id", controller.getById);

organizationRouter.get("/invitations/token/:token", controller.getByToken);

organizationRouter.patch(
  "/invitations/:id",
  validateBody(updateInvitationSchema),
  controller.updateById,
);

organizationRouter.patch(
  "/invitations/token/:token",
  validateBody(updateInvitationSchema),
  controller.updateByToken,
);

organizationRouter.delete("/invitations/:id", controller.delete);

export default organizationRouter;
