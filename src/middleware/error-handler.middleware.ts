import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export const ErrorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  if (createError.isHttpError(error))
    return res.status(error.statusCode).json({ message: error.message });
  return res.status(500).json({ message: "Internal error" });
};
