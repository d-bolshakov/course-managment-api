import { ReviewStatus } from "../../entities/Review.entity.js";

export class CreateReviewDto {
  readonly status: ReviewStatus;

  readonly comment: string;

  readonly markId?: number;
}
