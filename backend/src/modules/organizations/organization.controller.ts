import { Request, Response, NextFunction } from "express";

import { OrganizationService } from "./organization.service";
import { organizationIdSchema } from "./organization.schema";

export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organization = await this.service.create(req.body);

      res.status(201).json({
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizationId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id || "";
      const result = organizationIdSchema.safeParse(organizationId);
      if (!result.success) {
        next(result.error);
        return;
      }
      const organization = await this.service.getById(organizationId);

      res.status(200).json({
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organization = await this.service.getBySlug(
        Array.isArray(req.params.slug)
          ? req.params.slug[0]
          : req.params.slug || "",
      );

      res.status(200).json({
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organization = await this.service.update(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "",
        req.body,
      );

      res.status(200).json({
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organization = await this.service.updateStatus(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "",
        req.body.status,
      );

      res.status(200).json({
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  };
}
