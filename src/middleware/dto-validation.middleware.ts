import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { BadRequest } from "http-errors";

export const DtoValidationMiddleware = (
  dto: any,
  reqTargetProperty: "body" | "query",
  options?: {
    skipMissingProperties?: boolean;
    groups?: string[];
    exposeUnsetFields?: boolean;
  }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dto, req[reqTargetProperty], {
      groups: options?.groups,
      exposeUnsetFields: options?.exposeUnsetFields,
    });
    validate(dtoObj, {
      skipMissingProperties:
        options?.skipMissingProperties ||
        (reqTargetProperty === "query" && true),
      groups: options?.groups,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const dtoErrors = errors
          .map((error: ValidationError) =>
            (Object as any).values(error.constraints)
          )
          .join(", ");
        next(BadRequest(dtoErrors));
      } else {
        req[reqTargetProperty] = dtoObj;
        next();
      }
    });
  };
};
