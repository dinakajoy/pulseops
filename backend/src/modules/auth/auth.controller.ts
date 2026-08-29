import { Request, Response, NextFunction } from "express";

import { AuthService } from "./auth.service";
import { validatePostgresId } from "../../shared/utils";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizationId = Array.isArray(req.params.organizationId)
        ? req.params.organizationId[0]
        : req.params.organizationId || "";
      const validateId = validatePostgresId.safeParse(organizationId);
      if (!validateId.success) {
        next(validateId.error);
        return;
      }
      const user = await this.authService.register({
        ...req.body,
        organizationId,
      });

      res.status(201).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
