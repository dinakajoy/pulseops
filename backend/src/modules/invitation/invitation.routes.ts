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

const invitationRouter = Router();

const repository = new PostgresInvitationRepository(pool);

const service = new InvitationService(repository);

const controller = new InvitationController(service);

invitationRouter.post(
  "/invitations",
  validateBody(createInvitationSchema),
  controller.create,
);

invitationRouter.get("/invitations", controller.getAll);

invitationRouter.get("/invitations/:id", controller.getById);

invitationRouter.patch(
  "/invitations/:id",
  validateBody(updateInvitationSchema),
  controller.update,
);

invitationRouter.post("/invitations/:id/resend", controller.resend);

invitationRouter.post("/invitations/accept/:token", controller.accept);

invitationRouter.delete("/invitations/:id", controller.delete);

export default invitationRouter;
