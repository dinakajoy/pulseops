import { Router } from "express";

import { pool } from "../../shared/database/pool";
import { validateBody } from "../../shared/http/validate";

import { createUserSchema } from "./users.schema";

import { PostgresUserRepository } from "./users.repository";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";

const userRouter = Router();

const repository = new PostgresUserRepository(pool);

const service = new UserService(repository);

const controller = new UserController(service);

userRouter.post("/users", validateBody(createUserSchema), controller.create);

export default userRouter;
