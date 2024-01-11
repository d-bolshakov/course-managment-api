import { Router } from "express";
import {
  assignmentController,
  courseController,
  enrollmentController,
  markController,
  submissionController,
} from "../controllers/";
import {
  AuthMiddleware,
  DtoValidationMiddleware,
  IdValidationMiddleware,
} from "../middleware/";
import { CourseDto, BaseDtoGroups } from "../dto/";
import {
  AssignmentFilterDto,
  CourseFilterDto,
  EnrollmentFilterDto,
  MarkFilterDto,
  SubmissionFilterDto,
} from "../dto/filters";

export const CourseRouter = Router();

CourseRouter.post(
  "/",
  AuthMiddleware,
  DtoValidationMiddleware(CourseDto, "body", {
    groups: [BaseDtoGroups.CREATE],
  }),
  courseController.create
);
CourseRouter.get(
  "/",
  DtoValidationMiddleware(CourseFilterDto, "query"),
  courseController.getMany
);
CourseRouter.get(
  "/:courseId",
  IdValidationMiddleware("courseId"),
  courseController.getOne
);
CourseRouter.get(
  "/:courseId/marks",
  IdValidationMiddleware("courseId"),
  DtoValidationMiddleware(MarkFilterDto, "query"),
  markController.getMarksByCourse
);
CourseRouter.patch(
  "/:courseId",
  IdValidationMiddleware("courseId"),
  AuthMiddleware,
  DtoValidationMiddleware(CourseDto, "body", {
    groups: [BaseDtoGroups.UPDATE],
    skipMissingProperties: true,
  }),
  courseController.update
);
CourseRouter.delete(
  "/:courseId",
  IdValidationMiddleware("courseId"),
  AuthMiddleware,
  courseController.delete
);
CourseRouter.post(
  "/:courseId/enrollments/",
  IdValidationMiddleware("courseId"),
  AuthMiddleware,
  enrollmentController.create
);
CourseRouter.get(
  "/:courseId/enrollments/",
  IdValidationMiddleware("courseId"),
  DtoValidationMiddleware(EnrollmentFilterDto, "query"),
  AuthMiddleware,
  enrollmentController.getEnrollmentsByCourse
);
CourseRouter.get(
  "/:courseIdid/enrollments/:enrollmentId",
  IdValidationMiddleware("courseId"),
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware,
  enrollmentController.getOne
);
CourseRouter.patch(
  "/:courseId/enrollments/:enrollmentId",
  IdValidationMiddleware("courseId"),
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware,
  enrollmentController.update
);
CourseRouter.delete(
  "/:courseId/enrollments/:enrollmentId",
  IdValidationMiddleware("courseId"),
  IdValidationMiddleware("enrollmentId"),
  AuthMiddleware,
  enrollmentController.delete
);
CourseRouter.post(
  "/:courseId/assignments/",
  IdValidationMiddleware("courseId"),
  AuthMiddleware,
  assignmentController.create
);
CourseRouter.get(
  "/:courseId/assignments/",
  IdValidationMiddleware("courseId"),
  DtoValidationMiddleware(AssignmentFilterDto, "query"),
  AuthMiddleware,
  assignmentController.getAssignmentsByCourse
);
CourseRouter.post(
  "/:courseId/assignments/:assignmentId/submissions",
  IdValidationMiddleware("courseId"),
  IdValidationMiddleware("assignmentId"),
  AuthMiddleware,
  submissionController.create
);
CourseRouter.get(
  "/:courseId/assignments/:assignmentId/submissions",
  IdValidationMiddleware("courseId"),
  IdValidationMiddleware("assignmentId"),
  DtoValidationMiddleware(SubmissionFilterDto, "query"),
  AuthMiddleware,
  submissionController.getSubmissionsByAssignment
);
