import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { SubmissionAccessStrategy } from "../middleware/access-strategies/submission.access-strategy.js";
import { AssignmentAccessStrategy } from "../middleware/access-strategies/assignment.access-strategy.js";
import { SubmissionController } from "../controllers/submission.controller.js";
import { ReviewSubmissionDto } from "../dto/submission/review-submission.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";
import { CreateSubmissionDto } from "../dto/submission/create-submission.dto.js";
import upload from "express-fileupload";
import { container } from "tsyringe";
import { FilterBaseSubmissionDto } from "../dto/submission/filter-base-submission.dto.js";

export const SubmissionRouter = Router({ mergeParams: true });

const controller = container.resolve<SubmissionController>(
  "submission-controller"
);

SubmissionRouter.post(
  "/",
  AuthMiddleware({ loadProfile: true }),
  RoleMiddleware({ target: [Role.STUDENT] }),
  upload({ limits: { fileSize: 1024 * 1024 * 20 } }),
  DtoValidationMiddleware(CreateSubmissionDto, "body"),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "body",
  }),
  controller.create.bind(controller)
);
SubmissionRouter.get(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "query",
  }),
  DtoValidationMiddleware(FilterBaseSubmissionDto, "query"),
  controller.getSubmissionsByAssignment.bind(controller)
);
SubmissionRouter.get(
  "/:submissionId",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware(),
  AccessMiddleware(new SubmissionAccessStrategy(), {
    property: "submissionId",
    propertyLocation: "params",
  }),
  controller.getOne.bind(controller)
);
SubmissionRouter.delete(
  "/:submissionId",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.STUDENT] }),
  AccessMiddleware(new SubmissionAccessStrategy(), {
    property: "submissionId",
    propertyLocation: "params",
  }),
  controller.delete.bind(controller)
);
SubmissionRouter.post(
  "/:submissionId/review",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new SubmissionAccessStrategy(), {
    property: "submissionId",
    propertyLocation: "params",
  }),
  DtoValidationMiddleware(ReviewSubmissionDto, "body"),
  controller.review.bind(controller)
);
