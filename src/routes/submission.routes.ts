import { Router } from "express";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { SubmissionAccessStrategy } from "../middleware/access-strategies/submission.access-strategy.js";
import { AssignmentAccessStrategy } from "../middleware/access-strategies/assignment.access-strategy.js";
import { submissionController } from "../controllers/submission.controller.js";
import { CreateReviewDto } from "../dto/review/create-review.dto.js";
import { FilterSubmissionDto } from "../dto/submission/filter-submission.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";

export const SubmissionRouter = Router({ mergeParams: true });

SubmissionRouter.post(
  "/",
  AuthMiddleware({ loadProfile: true }),
  RoleMiddleware({ target: [Role.STUDENT] }),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "body",
  }),
  submissionController.create
);
SubmissionRouter.get(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  AccessMiddleware(new AssignmentAccessStrategy(), {
    property: "assignmentId",
    propertyLocation: "query",
  }),
  DtoValidationMiddleware(FilterSubmissionDto, "query"),
  submissionController.getSubmissionsByAssignment
);
SubmissionRouter.get(
  "/:submissionId",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware(),
  AccessMiddleware(new SubmissionAccessStrategy(), {
    property: "submissionId",
    propertyLocation: "params",
  }),
  submissionController.getOne
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
  submissionController.delete
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
  DtoValidationMiddleware(CreateReviewDto, "body"),
  submissionController.review
);
