import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { Role } from "../entities/User.entity.js";

export const ProfileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || (!req.user.studentProfile && !req.user.teacherProfile))
    return next(createError.Forbidden());
  const subPath = req.path.split("/me/")[1];
  if (req.user.role === Role.STUDENT) {
    let basePath = `/students/${req.user.studentProfile.id}/`;
    if (subPath) basePath += subPath;
    return res.redirect(307, basePath);
  } else if (req.user.role === Role.TEACHER) {
    let basePath = `/teachers/${req.user.teacherProfile.id}/`;
    if (subPath) basePath += subPath;
    return res.redirect(307, basePath);
  }
};
