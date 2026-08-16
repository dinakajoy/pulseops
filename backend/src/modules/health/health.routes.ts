import { Router } from "express";

import { getHealth, getReadiness } from "./health.controller";

const healthRouter = Router();

healthRouter.get("/health", getHealth);

healthRouter.get("/health/ready", getReadiness);

export default healthRouter;
