import { Request, Response, NextFunction } from "express";

import { InvitationService } from "./invitation.service";
import { organizationIdSchema } from "../organizations/organization.schema";

export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { organizationId, email, roleId } = req.body;

      const result = await this.service.create({
        organizationId,
        email,
        roleId,
        // createdBy: req.user?.id ?? null,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const invitations = await this.service.getAll(
        "req.params.organizationId",
      );

      res.status(200).json({
        data: invitations,
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
      const invitationId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id || "";
      const result = organizationIdSchema.safeParse(invitationId);
      if (!result.success) {
        next(result.error);
        return;
      }
      const invitation = await this.service.getById(
        invitationId,
        "req.params.organizationId",
      );

      res.status(200).json({
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  getByToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const invitation = await this.service.getByTokenHash(
        Array.isArray(req.params.token)
          ? req.params.token[0]
          : req.params.token || "",
        "req.params.organizationId",
      );

      res.status(200).json({
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  updateById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const invitation = await this.service.updateById(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "",
        "req.params.organizationId",
        req.body,
      );

      res.status(200).json({
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  updateByToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const invitation = await this.service.updateByToken(
        Array.isArray(req.params.token)
          ? req.params.token[0]
          : req.params.token || "",
        "req.params.organizationId",
        req.body,
      );

      res.status(200).json({
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.delete(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "",
        req.body.organizationId,
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
