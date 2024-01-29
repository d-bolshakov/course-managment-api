import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import createError from "http-errors";

const getErrorMessagesArray = (errors: ValidationError[]) => {
  const messages: string[] = [];
  for (const error of errors) {
    if (error.children?.length)
      messages.push(...getErrorMessagesArray(error.children));
    if (error.constraints)
      messages.push(...(Object as any).values(error.constraints));
  }
  return messages;
};

export const DtoValidationMiddleware = (
  dto: any,
  reqTargetProperty: "body" | "query"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dto, req[reqTargetProperty], {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    });
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const dtoErrors = getErrorMessagesArray(errors).join(", ");
        next(createError.BadRequest(dtoErrors));
      } else {
        req[reqTargetProperty] = dtoObj;
        next();
      }
    });
  };
};
