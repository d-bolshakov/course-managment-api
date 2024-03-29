import { Router } from "express";
import { EnrollmentAccessStrategy } from "../middleware/access-strategies/enrollment.access-strategy.js";
import { UpdateEnrollmentDto } from "../dto/enrollment/update-enrollment.dto.js";
import { Role } from "../db/entities/User.entity.js";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";
import { container } from "tsyringe";
import type { EnrollmentController } from "../controllers/enrollment.controller.js";

export const getEnrollmentRouter = () => {
  const EnrollmentRouter = Router({ mergeParams: true });

  const controller = container.resolve<EnrollmentController>(
    "enrollment-controller"
  );

  EnrollmentRouter.get(
    "/:enrollmentId",
    AuthMiddleware(),
    AccessMiddleware(new EnrollmentAccessStrategy(), {
      property: "enrollmentId",
      propertyLocation: "params",
    }),
    controller.getOne.bind(controller)
  );
  EnrollmentRouter.patch(
    "/:enrollmentId",
    AuthMiddleware(),
    RoleMiddleware({ target: [Role.TEACHER] }),
    AccessMiddleware(new EnrollmentAccessStrategy(), {
      property: "enrollmentId",
      propertyLocation: "params",
    }),
    DtoValidationMiddleware(UpdateEnrollmentDto, "body"),
    controller.update.bind(controller)
  );
  EnrollmentRouter.delete(
    "/:enrollmentId",
    AuthMiddleware(),
    AccessMiddleware(new EnrollmentAccessStrategy(), {
      property: "enrollmentId",
      propertyLocation: "params",
    }),
    controller.delete.bind(controller)
  );
  return EnrollmentRouter;
};
