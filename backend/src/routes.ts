import { Router } from "express";

import healthRoutes from "./modules/health/health.routes";
import organizationRoutes from "./modules/organizations/organization.routes";

const routes = Router();

routes.use(healthRoutes);
routes.use(organizationRoutes);

export default routes;
