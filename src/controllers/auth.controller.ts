import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { inject, injectable } from "tsyringe";
import type { IUserService } from "../interfaces/services/user-service.interface.js";

@injectable()
export class AuthController {
  constructor(@inject("user-service") private userService: IUserService) {}

  async login({ body, session }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService!.login(body);
      session.user = { id: response!.id };
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async registration(
    { body, session }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.userService!.create(body);
      session.user = { id: response.id };
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async logout({ session }: Request, res: Response, next: NextFunction) {
    try {
      session.destroy((err) => {
        throw createError.InternalServerError(err);
      });
      res.status(201).json({ message: "Logged out successfully" });
    } catch (e) {
      next(e);
    }
  }
}
