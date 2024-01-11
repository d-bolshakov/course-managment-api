import { Router } from "express";
import {
  assignmentController,
  courseController,
  enrollmentController,
  markController,
  submissionController,
} from "../controllers";
import {
  AuthMiddleware,
  DtoValidationMiddleware,
  IdValidationMiddleware,
} from "../middleware";
import { CourseDto, BaseDtoGroups, SubmissionReviewDto } from "../dto";
import { MarkFilterDto, SubmissionFilterDto } from "../dto/filters";

export const SubmissionRouter = Router();

SubmissionRouter.get(
  "/",
  DtoValidationMiddleware(SubmissionFilterDto, "query"),
  submissionController.getMany
);
SubmissionRouter.get(
  "/:submissionId",
  IdValidationMiddleware("submissionId"),
  submissionController.getOne
);
SubmissionRouter.get(
  "/:submissionId/marks",
  IdValidationMiddleware("submissionId"),
  DtoValidationMiddleware(MarkFilterDto, "query"),
  markController.getMarksBySubmission
);
SubmissionRouter.delete(
  "/:submissionId",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware,
  submissionController.delete
);
SubmissionRouter.patch(
  "/:submissionId/review",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware,
  DtoValidationMiddleware(SubmissionReviewDto, "body", {
    groups: [BaseDtoGroups.CREATE],
  }),
  submissionController.review
);
