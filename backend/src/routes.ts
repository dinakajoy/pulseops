import { Router } from "express";

import healthRoutes from "./modules/health/health.routes";
import organizationRoutes from "./modules/organizations/organization.routes";
import invitationRoutes from "./modules/invitation/invitation.routes";

const routes = Router();

routes.use(healthRoutes);
routes.use(organizationRoutes);
routes.use(invitationRoutes);

export default routes;
