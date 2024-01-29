import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../db/data-source.js";
import { plainToInstance } from "class-transformer";
import { UserDto } from "../dto/user/user.dto.js";
import { User } from "../entities/User.entity.js";

export const AuthMiddleware = (options?: {
  strict?: boolean;
  loadProfile?: boolean;
  passOnRedirect?: boolean;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (options?.passOnRedirect && req.query._method) return next();
    if (!req.session.user && options?.strict)
      return next(createError.Forbidden());
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req.session.user!.id },
      relations: {
        studentProfile: options?.loadProfile,
        teacherProfile: options?.loadProfile,
      },
    });
    req.user = plainToInstance(UserDto, user);
    next();
  };
};
