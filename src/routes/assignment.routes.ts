import { Router } from "express";
import {
  assignmentController,
  courseController,
  enrollmentController,
  markController,
} from "../controllers";
import {
  AuthMiddleware,
  DtoValidationMiddleware,
  IdValidationMiddleware,
} from "../middleware";
import { CourseDto } from "../dto";
import { FilterAssignmentDto, FilterMarkDto } from "../dto/";

export const AssignmentRouter = Router();

AssignmentRouter.get(
  "/",
  DtoValidationMiddleware(FilterAssignmentDto, "query"),
  assignmentController.getMany
);
AssignmentRouter.get(
  "/:assignmentId",
  IdValidationMiddleware("assignmentId"),
  assignmentController.getOne
);
AssignmentRouter.get(
  "/:assignmentId/marks",
  IdValidationMiddleware("assignmentId"),
  DtoValidationMiddleware(FilterMarkDto, "query"),
  markController.getMarksByAssignment
);
AssignmentRouter.patch(
  "/:assignmentId",
  IdValidationMiddleware("assignmentId"),
  AuthMiddleware,
  // DtoValidationMiddleware(CourseDto, "body", {
  //   groups: [BaseDtoGroups.UPDATE],
  //   skipMissingProperties: true,
  // }),
  assignmentController.update
);
AssignmentRouter.delete(
  "/:assignmentId",
  IdValidationMiddleware("assignmentId"),
  AuthMiddleware,
  assignmentController.delete
);
