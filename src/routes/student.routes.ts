import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { StudentAccessStrategy } from "../middleware/access-strategies/student.access-strategy.js";
import { FilterStudentAssignmentDto } from "../dto/assignment/filter-student-assignment.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { container } from "tsyringe";
import type { StudentController } from "../controllers/student.controller.js";
import { FilterBaseCourseDto } from "../dto/course/filter-base-course.dto.js";
import { FilterBaseSubmissionDto } from "../dto/submission/filter-base-submission.dto.js";

export const getStudentRouter = () => {
  const StudentRouter = Router();

  const controller = container.resolve<StudentController>("student-controller");

  StudentRouter.post("/", AuthMiddleware(), controller.create.bind(controller));

  StudentRouter.get("/", controller.getMany.bind(controller));
  StudentRouter.get("/:studentId", controller.getOne.bind(controller));
  StudentRouter.get(
    "/:studentId/courses",
    AuthMiddleware(),
    DtoValidationMiddleware(FilterBaseCourseDto, "query"),
    controller.getCoursesOfStudent.bind(controller)
  );
  StudentRouter.get(
    "/:studentId/assignments",
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
    AuthMiddleware(),
    AccessMiddleware(new StudentAccessStrategy(), {
      property: "studentId",
      propertyLocation: "params",
    }),
    DtoValidationMiddleware(FilterBaseSubmissionDto, "query"),
    controller.getSubmissionsOfStudent.bind(controller)
  );
  StudentRouter.delete(
    "/:studentId",
    AuthMiddleware(),
    AccessMiddleware(new StudentAccessStrategy(), {
      property: "studentId",
      propertyLocation: "params",
    }),
    controller.delete.bind(controller)
  );
  return StudentRouter;
};
