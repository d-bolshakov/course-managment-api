import { Router } from "express";

import { AccessMiddleware } from "../middleware/access.middleware.js";
import { StudentAccessStrategy } from "../middleware/access-strategies/student.access-strategy.js";
import { studentController } from "../controllers/student.controller.js";
import { FilterStudentAssignmentDto } from "../dto/assignment/filter-student-assignment.dto.js";
import { FilterTeacherCourseDto } from "../dto/course/filter-teacher-course.dto.js";
import { FilterSubmissionDto } from "../dto/submission/filter-submission.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";

export const StudentRouter = Router();

StudentRouter.get(
  "/",
  DtoValidationMiddleware(FilterTeacherDto, "query"),
  studentController.getMany
);
StudentRouter.get(
  "/:studentId",
  IdValidationMiddleware("studentId"),
  studentController.getOne
);
StudentRouter.get(
  "/:studentId/courses",
  IdValidationMiddleware("studentId"),
  AuthMiddleware(),
  DtoValidationMiddleware(FilterTeacherCourseDto, "query"),
  studentController.getCoursesOfStudent
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
  studentController.getAssignmentsOfStudent
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
  studentController.getSubmissionsOfStudent
);
StudentRouter.put(
  "/:studentId",
  IdValidationMiddleware("studentId"),
  AuthMiddleware(),
  AccessMiddleware(new StudentAccessStrategy(), {
    property: "studentId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(UpdateTeacherDto, "body"),
  studentController.update
);
StudentRouter.delete(
  "/:studentId",
  IdValidationMiddleware("studentId"),
  AuthMiddleware(),
  AccessMiddleware(new StudentAccessStrategy(), {
    property: "studentId",
    propertyLocation: "params",
  }),
  studentController.delete
);
