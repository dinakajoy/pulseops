import { Request, Response, NextFunction } from "express";

import { UserService } from "./users.service";

export class UserController {
  constructor(private readonly service: UserService) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.service.create(req.body);

      res.status(201).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
