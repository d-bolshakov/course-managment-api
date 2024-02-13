import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { TeacherAccessStrategy } from "../middleware/access-strategies/teacher.access-strategy.js";
import { FilterTeacherCourseDto } from "../dto/course/filter-teacher-course.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { container } from "tsyringe";
import type { TeacherController } from "../controllers/teacher.controller.js";
import { FilterBaseAssignmentDto } from "../dto/assignment/filter-base-assignment.dto.js";
import { FilterBaseSubmissionDto } from "../dto/submission/filter-base-submission.dto.js";

export const TeacherRouter = Router();

const controller = container.resolve<TeacherController>("teacher-controller");

TeacherRouter.get(
  "/",
  DtoValidationMiddleware(FilterTeacherDto, "query"),
  controller.getMany.bind(controller)
);
TeacherRouter.get(
  "/:teacherId",
  IdValidationMiddleware("teacherId"),
  controller.getOne.bind(controller)
);

TeacherRouter.get(
  "/:teacherId/courses",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware(),
  DtoValidationMiddleware(FilterTeacherCourseDto, "query"),
  controller.getCoursesOfTeacher.bind(controller)
);
TeacherRouter.get(
  "/:teacherId/assignments",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware(),
  AccessMiddleware(new TeacherAccessStrategy(), {
    property: "teacherId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(FilterBaseAssignmentDto, "query"),
  controller.getAssignmentsOfTeacher.bind(controller)
);
TeacherRouter.get(
  "/:teacherId/submissions",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware(),
  AccessMiddleware(new TeacherAccessStrategy(), {
    property: "teacherId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(FilterBaseSubmissionDto, "query"),
  controller.getSubmissionsOfTeacher.bind(controller)
);
TeacherRouter.put(
  "/:teacherId",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware({ passOnRedirect: true }),
  AccessMiddleware(
    new TeacherAccessStrategy(),
    {
      property: "teacherId",
      propertyLocation: "params",
    },
    { passOnRedirect: true }
  ),
  DtoValidationMiddleware(UpdateTeacherDto, "body"),
  controller.update.bind(controller)
);
// TeacherRouter.delete(
//   "/:teacherId",
//   IdValidationMiddleware("teacherId"),
//   AuthMiddleware({ passOnRedirect: true }),
//   AccessMiddleware(
//     new TeacherAccessStrategy(),
//     {
//       property: "teacherId",
//       propertyLocation: "params",
//     },
//     {
//       passOnRedirect: true,
//     }
//   ),
//   teacherController.delete.bind(controller)
// );
