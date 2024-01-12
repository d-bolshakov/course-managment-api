import { Router } from "express";
import { courseController, enrollmentController } from "../controllers";
import {
  AuthMiddleware,
  DtoValidationMiddleware,
  IdValidationMiddleware,
} from "../middleware";

export const EnrollmentRouter = Router();

EnrollmentRouter.get(
  "/",
  //  DtoValidationMiddleware(FilterCourseDto, "query"),
  enrollmentController.getMany
);
EnrollmentRouter.get(
  "/:enrollmentId",
  IdValidationMiddleware("enrollmentId"),
  enrollmentController.getOne
);
EnrollmentRouter.patch(
  "/:enrollmentId",
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware,
  // DtoValidationMiddleware(CourseDto, "body", {
  //   groups: [BaseDtoGroups.UPDATE],
  //   skipMissingProperties: true,
  // }),
  enrollmentController.update
);
EnrollmentRouter.delete(
  "/:enrollmentId",
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware,
  enrollmentController.delete
);
