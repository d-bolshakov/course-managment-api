import type { CreateReviewDto } from "../../dto/review/create-review.dto";
import type { ReviewDto } from "../../dto/review/review.dto";

export interface IReviewRepository {
  create(dto: CreateReviewDto): Promise<ReviewDto>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<ReviewDto | null>;
  getMany(): Promise<ReviewDto[]>;
  existsWithId(id: number): Promise<boolean>;
}
