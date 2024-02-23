import { CreateReviewDto } from "../../../dto/review/create-review.dto";
import { ReviewDto } from "../../../dto/review/review.dto";

export interface IReviewService {
  create(dto: CreateReviewDto): Promise<ReviewDto>;

  delete(id: number): Promise<{ success: boolean }>;
}
