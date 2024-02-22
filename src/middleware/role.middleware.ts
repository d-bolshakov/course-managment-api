import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { Role } from "../db/entities/User.entity.js";

export const RoleMiddleware = (options: {
  target: Role[];
  passOnRedirect?: boolean;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (options.passOnRedirect && req.query._method) return next();
    if (req.user!.role === Role.ADMIN) return next();
    if (!options.target.includes(req.user!.role)) next(createError.Forbidden());
    next();
  };
};
