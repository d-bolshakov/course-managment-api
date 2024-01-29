import { Router } from "express";

import { AccessMiddleware } from "../middleware/access.middleware.js";
import { CourseAccessStrategy } from "../middleware/access-strategies/course.access-strategy.js";
import { EnrollmentRouter } from "./enrollment.routes.js";
import { courseController } from "../controllers/course.controller.js";
import { enrollmentController } from "../controllers/enrollment.controller.js";
import { CreateCourseDto } from "../dto/course/create-course.dto.js";
import { FilterCourseDto } from "../dto/course/filter-course.dto.js";
import { UpdateCourseDto } from "../dto/course/update-course.dto.js";
import { FilterEnrollmentDto } from "../dto/enrollment/filter-enrollment.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";

export const CourseRouter = Router();

CourseRouter.post(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  DtoValidationMiddleware(CreateCourseDto, "body"),
  courseController.create
);
CourseRouter.get(
  "/",
  DtoValidationMiddleware(FilterCourseDto, "query"),
  courseController.getMany
);
CourseRouter.get(
  "/:courseId",
  IdValidationMiddleware("courseId"),
  courseController.getOne
);
CourseRouter.patch(
  "/:courseId",
  IdValidationMiddleware("courseId"),
  AuthMiddleware(),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(UpdateCourseDto, "body"),
  courseController.update
);
CourseRouter.delete(
  "/:courseId",
  IdValidationMiddleware("courseId"),
  AuthMiddleware(),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "params",
  }),
  courseController.delete
);
CourseRouter.post(
  "/:courseId/enrollments/",
  IdValidationMiddleware("courseId"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.STUDENT] }),
  enrollmentController.create
);
CourseRouter.get(
  "/:courseId/enrollments/",
  IdValidationMiddleware("courseId"),
  DtoValidationMiddleware(FilterEnrollmentDto, "query"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "params",
  }),
  enrollmentController.getEnrollmentsByCourse
);
CourseRouter.use("/:courseId/enrollments", EnrollmentRouter);
