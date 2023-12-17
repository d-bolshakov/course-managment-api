import { Forbidden } from "http-errors";
import { userService } from "../services/user.service";
import { Request, Response, NextFunction } from "express";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) return next(Forbidden());
  req.user = await userService.getById(req.session.user.id);
  next();
};
