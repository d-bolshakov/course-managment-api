import createError from "http-errors";
import type { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import type { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";

export const AuthMiddleware = (options?: {
  strict?: boolean;
  passOnRedirect?: boolean;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (options?.passOnRedirect && req.query._method) return next();
    if (!req.session.user && options?.strict)
      return next(createError.Forbidden());
    const userRepository =
      container.resolve<IUserRepository>("user-repository");
    const user = await userRepository.getById(req.session.user!.id);
    if (!user) throw createError.Forbidden();
    req.user = user;
    next();
  };
};
