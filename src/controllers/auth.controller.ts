import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";

class AuthController {
  async login({ body, session }: Request, res: Response, next: NextFunction) {
    try {
      const response = await authService.login(body, session);
      res.status(201).json(response);
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
      const response = await authService.registration(body, session);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async logout({ session }: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await authService.logout(session));
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
