import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { AssignmentAccessStrategy } from "../middleware/access-strategies/assignment.access-strategy.js";
import { CourseAccessStrategy } from "../middleware/access-strategies/course.access-strategy.js";
import { SubmissionRouter } from "./submission.routes.js";
import { assignmentController } from "../controllers/assignment.controller.js";
import { CreateAssignmentDto } from "../dto/assignment/create-assignment.dto.js";
import { FilterAssignmentDto } from "../dto/assignment/filter-assignment.dto.js";
import { UpdateAssignmentDto } from "../dto/assignment/update-assignment.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";

export const AssignmentRouter = Router({ mergeParams: true });

AssignmentRouter.post(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  DtoValidationMiddleware(CreateAssignmentDto, "body"),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "body",
  }),
  assignmentController.create
);
AssignmentRouter.get(
  "/",
  DtoValidationMiddleware(FilterAssignmentDto, "query"),
  AuthMiddleware(),
  AccessMiddleware(new CourseAccessStrategy(), {
    property: "courseId",
    propertyLocation: "query",
  }),
  assignmentController.getAssignmentsByCourse
);
AssignmentRouter.get(
  "/:assignmentId",
  IdValidationMiddleware("assignmentId"),
  AuthMiddleware(),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "params",
  }),
  assignmentController.getOne
);
AssignmentRouter.patch(
  "/:assignmentId",
  IdValidationMiddleware("assignmentId"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(UpdateAssignmentDto, "body"),
  assignmentController.update
);
AssignmentRouter.delete(
  "/:assignmentId",
  IdValidationMiddleware("assignmentId"),
  AuthMiddleware(),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "params",
  }),
  assignmentController.delete
);
AssignmentRouter.use(
  "/:assignmentId/submissions",
  IdValidationMiddleware("assignmentId"),
  SubmissionRouter
);
