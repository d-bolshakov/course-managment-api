import { Router } from "express";

import { AccessMiddleware } from "../middleware/access.middleware.js";
import { TeacherAccessStrategy } from "../middleware/access-strategies/teacher.access-strategy.js";
import { teacherController } from "../controllers/teacher.controller.js";
import { FilterAssignmentDto } from "../dto/assignment/filter-assignment.dto.js";
import { FilterTeacherCourseDto } from "../dto/course/filter-teacher-course.dto.js";
import { FilterSubmissionDto } from "../dto/submission/filter-submission.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";

export const TeacherRouter = Router();

TeacherRouter.get(
  "/",
  DtoValidationMiddleware(FilterTeacherDto, "query"),
  teacherController.getMany
);
TeacherRouter.get(
  "/:teacherId",
  IdValidationMiddleware("teacherId"),
  teacherController.getOne
);

TeacherRouter.get(
  "/:teacherId/courses",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware(),
  DtoValidationMiddleware(FilterTeacherCourseDto, "query"),
  teacherController.getCoursesOfTeacher
);
TeacherRouter.get(
  "/:teacherId/assignments",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware(),
  AccessMiddleware(new TeacherAccessStrategy(), {
    property: "teacherId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(FilterAssignmentDto, "query"),
  teacherController.getAssignmentsOfTeacher
);
TeacherRouter.get(
  "/:teacherId/submissions",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware(),
  AccessMiddleware(new TeacherAccessStrategy(), {
    property: "teacherId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(FilterSubmissionDto, "query"),
  teacherController.getSubmissionsOfTeacher
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
  teacherController.update
);
TeacherRouter.delete(
  "/:teacherId",
  IdValidationMiddleware("teacherId"),
  AuthMiddleware({ passOnRedirect: true }),
  AccessMiddleware(
    new TeacherAccessStrategy(),
    {
      property: "teacherId",
      propertyLocation: "params",
    },
    {
      passOnRedirect: true,
    }
  ),
  teacherController.delete
);
