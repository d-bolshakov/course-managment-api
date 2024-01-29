import { NextFunction, Request, Response } from "express";
import { AccessStrategy } from "./access-strategies/access-strategy.js";
import { AccessContext } from "./access-strategies/access-context.js";
import createError from "http-errors";

export const AccessMiddleware = (
  strategy: AccessStrategy,
  resourse: {
    propertyLocation: "query" | "body" | "params";
    property: string;
  },
  options?: { passOnRedirect: boolean }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (options?.passOnRedirect && req.query._method) return next();
    if (!req[resourse.propertyLocation][resourse.property])
      return next(new createError.Forbidden());
    const ctx = new AccessContext(strategy);
    const hasAccess = await ctx.checkAccess(req.user!, {
      [resourse.property]: req[resourse.propertyLocation][resourse.property],
    });
    if (hasAccess) return next();
    return next(new createError.Forbidden());
  };
};
