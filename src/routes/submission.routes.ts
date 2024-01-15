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
import { FilterMarkDto, FilterSubmissionDto, CreateReviewDto } from "../dto/";

export const SubmissionRouter = Router();

SubmissionRouter.get(
  "/",
  DtoValidationMiddleware(FilterSubmissionDto, "query"),
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
  DtoValidationMiddleware(FilterMarkDto, "query"),
  markController.getMarksBySubmission
);
SubmissionRouter.delete(
  "/:submissionId",
  IdValidationMiddleware("submissionId"),
  AuthMiddleware,
  submissionController.delete
);
// SubmissionRouter.patch(
//   "/:submissionId/review",
//   IdValidationMiddleware("submissionId"),
//   AuthMiddleware,
//   DtoValidationMiddleware(CreateSubmissionReviewDto, "body"),
//   submissionController.review
// );
