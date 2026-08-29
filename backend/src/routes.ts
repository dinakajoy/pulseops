import { Router } from "express";

import healthRoutes from "./modules/health/health.routes";
import organizationRoutes from "./modules/organizations/organization.routes";
import invitationRoutes from "./modules/invitation/invitation.routes";
import authRoutes from "./modules/auth/auth.routes";

const routes = Router();

routes.use(healthRoutes);
routes.use(organizationRoutes);
routes.use(invitationRoutes);
routes.use(authRoutes);

export default routes;
