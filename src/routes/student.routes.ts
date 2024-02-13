import { Router } from "express";

import { AccessMiddleware } from "../middleware/access.middleware.js";
import { StudentAccessStrategy } from "../middleware/access-strategies/student.access-strategy.js";
import { FilterStudentAssignmentDto } from "../dto/assignment/filter-student-assignment.dto.js";
import { FilterTeacherCourseDto } from "../dto/course/filter-teacher-course.dto.js";
import { FilterSubmissionDto } from "../dto/submission/filter-submission.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { container } from "tsyringe";
import type { StudentController } from "../controllers/student.controller.js";

export const StudentRouter = Router();

const controller = container.resolve<StudentController>("student-controller");

StudentRouter.get(
  "/",
  DtoValidationMiddleware(FilterTeacherDto, "query"),
  controller.getMany.bind(controller)
);
StudentRouter.get(
  "/:studentId",
  IdValidationMiddleware("studentId"),
  controller.getOne.bind(controller)
);
StudentRouter.get(
  "/:studentId/courses",
  IdValidationMiddleware("studentId"),
  AuthMiddleware(),
  DtoValidationMiddleware(FilterTeacherCourseDto, "query"),
  controller.getCoursesOfStudent.bind(controller)
);
StudentRouter.get(
  "/:studentId/assignments",
  IdValidationMiddleware("studentId"),
  AuthMiddleware(),
  AccessMiddleware(new StudentAccessStrategy(), {
    property: "studentId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(FilterStudentAssignmentDto, "query"),
  controller.getAssignmentsOfStudent.bind(controller)
);
StudentRouter.get(
  "/:studentId/submissions",
  IdValidationMiddleware("studentId"),
  AuthMiddleware(),
  AccessMiddleware(new StudentAccessStrategy(), {
    property: "studentId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(FilterSubmissionDto, "query"),
  controller.getSubmissionsOfStudent.bind(controller)
);
// StudentRouter.put(
//   "/:studentId",
//   IdValidationMiddleware("studentId"),
//   AuthMiddleware(),
//   AccessMiddleware(new StudentAccessStrategy(), {
//     property: "studentId",
//     propertyLocation: "params",
//   }),
//   DtoValidationMiddleware(UpdateTeacherDto, "body"),
//   controller.update.bind(controller)
// );
// StudentRouter.delete(
//   "/:studentId",
//   IdValidationMiddleware("studentId"),
//   AuthMiddleware(),
//   AccessMiddleware(new StudentAccessStrategy(), {
//     property: "studentId",
//     propertyLocation: "params",
//   }),
//   controller.delete.bind(controller)
// );
