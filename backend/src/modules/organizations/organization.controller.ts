import { Request, Response, NextFunction } from "express";

import { OrganizationService } from "./organization.service";

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
      const organization = await this.service.getById(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "",
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
