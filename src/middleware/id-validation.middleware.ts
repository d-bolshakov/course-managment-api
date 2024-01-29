import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export const IdValidationMiddleware = (target: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const param = Number(req.params[target]);
    if (isNaN(param))
      return next(createError.BadRequest(`${target} should be a number`));
    //@ts-ignore
    req.params[target] = param;
    return next();
  };
};
