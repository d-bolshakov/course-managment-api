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
import { CourseDto, BaseDtoGroups } from "../dto";
import { AssignmentFilterDto, MarkFilterDto } from "../dto/filters";

export const AssignmentRouter = Router();

AssignmentRouter.get(
  "/",
  DtoValidationMiddleware(AssignmentFilterDto, "query"),
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
  DtoValidationMiddleware(MarkFilterDto, "query"),
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
