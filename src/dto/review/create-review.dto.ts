import { ReviewStatus } from "../../db/entities/Review.entity.js";

export class CreateReviewDto {
  readonly status: ReviewStatus;

  readonly comment: string;

  readonly markId?: number;
}
