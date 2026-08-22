import { Request, Response, NextFunction } from "express";

import { InvitationService } from "./invitation.service";
import { invitationIdSchema } from "./invitation.schema";

export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, roleId, organizationId } = req.body;

      const result = await this.service.create({
        email,
        roleId,
        organizationId,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const invitations = await this.service.getAll();

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
      const result = invitationIdSchema.safeParse(invitationId);
      if (!result.success) {
        next(result.error);
        return;
      }
      const invitation = await this.service.getById(invitationId);

      res.status(200).json({
        data: invitation,
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
      const invitation = await this.service.update(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "",
        req.body,
      );

      res.status(200).json({
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  resend = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const invitationId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id || "";
      const invitation = await this.service.resend(invitationId);

      res.status(200).json({
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  accept = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = Array.isArray(req.params.token)
        ? req.params.token[0]
        : req.params.token || "";

      const invitation = await this.service.accept(token);

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
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
