import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { AssignmentAccessStrategy } from "../middleware/access-strategies/assignment.access-strategy.js";
import { CourseAccessStrategy } from "../middleware/access-strategies/course.access-strategy.js";
import { getSubmissionRouter } from "./submission.routes.js";
import { AssignmentController } from "../controllers/assignment.controller.js";
import { CreateAssignmentDto } from "../dto/assignment/create-assignment.dto.js";
import { Role } from "../db/entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";
import upload from "express-fileupload";
import { container } from "tsyringe";
import { FilterBaseAssignmentDto } from "../dto/assignment/filter-base-assignment.dto.js";
import { UpdateAssignmentRequestBodyDto } from "../dto/assignment/update-assignment-request-body.dto.js";

export const getAssignmentRouter = () => {
  const AssignmentRouter = Router({ mergeParams: true });

  const controller = container.resolve<AssignmentController>(
    "assignment-controller"
  );

  AssignmentRouter.post(
    "/",
    AuthMiddleware(),
    RoleMiddleware({ target: [Role.TEACHER] }),
    upload({ limits: { fileSize: 1024 * 1024 * 20 } }),
    DtoValidationMiddleware(CreateAssignmentDto, "body"),
    AccessMiddleware(new CourseAccessStrategy(), {
      property: "courseId",
      propertyLocation: "body",
    }),
    controller.create.bind(controller)
  );
  AssignmentRouter.get(
    "/",
    DtoValidationMiddleware(FilterBaseAssignmentDto, "query"),
    AuthMiddleware(),
    AccessMiddleware(new CourseAccessStrategy(), {
      property: "courseId",
      propertyLocation: "query",
    }),
    controller.getAssignmentsByCourse.bind(controller)
  );
  AssignmentRouter.get(
    "/:assignmentId",
    AuthMiddleware(),
    AccessMiddleware(new AssignmentAccessStrategy(), {
      property: "assignmentId",
      propertyLocation: "params",
    }),
    controller.getOne.bind(controller)
  );
  AssignmentRouter.patch(
    "/:assignmentId",
    AuthMiddleware(),
    RoleMiddleware({ target: [Role.TEACHER] }),
    AccessMiddleware(new AssignmentAccessStrategy(), {
      property: "assignmentId",
      propertyLocation: "params",
    }),
    DtoValidationMiddleware(UpdateAssignmentRequestBodyDto, "body"),
    upload({ limits: { fileSize: 1024 * 1024 * 20 } }),
    controller.update.bind(controller)
  );
  AssignmentRouter.delete(
    "/:assignmentId",
    AuthMiddleware(),
    AccessMiddleware(new AssignmentAccessStrategy(), {
      property: "assignmentId",
      propertyLocation: "params",
    }),
    controller.delete.bind(controller)
  );
  AssignmentRouter.use("/:assignmentId/submissions", getSubmissionRouter());
  return AssignmentRouter;
};
