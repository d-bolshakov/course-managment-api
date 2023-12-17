import { NextFunction, Request, Response } from "express";
import { BadRequest } from "http-errors";

export const IdValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isNaN(Number(req.params.id)))
    return next(BadRequest("id should be a number"));
  return next();
};
