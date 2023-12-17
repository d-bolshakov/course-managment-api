import { Request, Response, NextFunction } from "express";
import { authService } from "../services/";
import { UserDto, BaseDtoGroups } from "../dto/";
import { plainToInstance } from "class-transformer";

class AuthController {
  async login({ body, session }: Request, res: Response, next: NextFunction) {
    try {
      const response = await authService.login(body, session);
      res.status(201).json(
        plainToInstance(UserDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
      res.status(201).json(
        plainToInstance(UserDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
