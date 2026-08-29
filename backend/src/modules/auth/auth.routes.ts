import { Router } from "express";

import { pool } from "../../shared/database/pool";
import { validateBody } from "../../shared/http/validate";

import { createUserSchema } from "./auth.schema";

import { PostgresAuthRepository } from "./auth.repository";
import { PostgresInvitationRepository } from "../invitation/invitation.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

const userRouter = Router();

const repository = new PostgresAuthRepository(pool);

const service = new AuthService(
  repository,
  new PostgresInvitationRepository(pool),
);

const controller = new AuthController(service);

userRouter.post(
  "/organizations/:organizationId/auth/register",
  validateBody(createUserSchema),
  controller.register,
);

export default userRouter;
