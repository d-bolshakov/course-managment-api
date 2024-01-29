import { Router } from "express";
import { EnrollmentAccessStrategy } from "../middleware/access-strategies/enrollment.access-strategy.js";
import { enrollmentController } from "../controllers/enrollment.controller.js";
import { UpdateEnrollmentDto } from "../dto/enrollment/update-enrollment.dto.js";
import { Role } from "../entities/User.entity.js";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";

export const EnrollmentRouter = Router({ mergeParams: true });

EnrollmentRouter.get(
  "/:enrollmentId",
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware(),
  AccessMiddleware(new EnrollmentAccessStrategy(), {
    property: "enrollmentId",
    propertyLocation: "params",
  }),
  enrollmentController.getOne
);
EnrollmentRouter.patch(
  "/:enrollmentId",
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new EnrollmentAccessStrategy(), {
    property: "enrollmentId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(UpdateEnrollmentDto, "body"),
  enrollmentController.update
);
EnrollmentRouter.delete(
  "/:enrollmentId",
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware(),
  AccessMiddleware(new EnrollmentAccessStrategy(), {
    property: "enrollmentId",
    propertyLocation: "params",
  }),
  enrollmentController.delete
);
