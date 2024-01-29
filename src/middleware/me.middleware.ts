import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export const MeMiddleware = (options: { targetReqParam: string }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(createError.Forbidden());
    if (req.params[options.targetReqParam] !== "me") return next();
    req.params[options.targetReqParam] = req.user.id;
    next();
  };
};
