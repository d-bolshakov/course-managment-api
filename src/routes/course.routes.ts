import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { CourseAccessStrategy } from "../middleware/access-strategies/course.access-strategy.js";
import { EnrollmentRouter } from "./enrollment.routes.js";
import { CourseController } from "../controllers/course.controller.js";
import { EnrollmentController } from "../controllers/enrollment.controller.js";
import { CreateCourseDto } from "../dto/course/create-course.dto.js";
import { UpdateCourseDto } from "../dto/course/update-course.dto.js";
import { FilterEnrollmentDto } from "../dto/enrollment/filter-enrollment.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";
import { container } from "tsyringe";
import { FilterBaseCourseDto } from "../dto/course/filter-base-course.dto.js";

export const CourseRouter = Router();

const courseController =
  container.resolve<CourseController>("course-controller");
const enrollmentController = container.resolve<EnrollmentController>(
  "enrollment-controller"
);

CourseRouter.post(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  DtoValidationMiddleware(CreateCourseDto, "body"),
  courseController.create.bind(courseController)
);
CourseRouter.get(
  "/",
  DtoValidationMiddleware(FilterBaseCourseDto, "query"),
  courseController.getMany.bind(courseController)
);
CourseRouter.get("/:courseId", courseController.getOne.bind(courseController));
CourseRouter.patch(
  "/:courseId",
  AuthMiddleware(),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(UpdateCourseDto, "body"),
  courseController.update.bind(courseController)
);
CourseRouter.delete(
  "/:courseId",
  AuthMiddleware(),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "params",
  }),
  courseController.delete.bind(courseController)
);
CourseRouter.post(
  "/:courseId/enrollments/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.STUDENT] }),
  enrollmentController.create.bind(enrollmentController)
);
CourseRouter.get(
  "/:courseId/enrollments/",
  DtoValidationMiddleware(FilterEnrollmentDto, "query"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "params",
  }),
  enrollmentController.getEnrollmentsByCourse.bind(enrollmentController)
);
CourseRouter.use("/:courseId/enrollments", EnrollmentRouter);
