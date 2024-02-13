import createError from "http-errors";
import { ReviewSubmissionDto } from "../dto/submission/review-submission.dto.js";
import { ReviewStatus } from "../entities/Review.entity.js";
import type { IReviewService } from "../interfaces/services/review-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { IReviewRepository } from "../interfaces/repositories/review-repository.interface.js";
import type { IMarkService } from "../interfaces/services/mark-service.interface.js";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject("review-repository") private reviewRepository: IReviewRepository,
    @inject("mark-service") private markService: IMarkService
  ) {}

  async create(dto: ReviewSubmissionDto) {
    let mark;
    if (dto.status === ReviewStatus.ACCEPTED && dto.mark)
      mark = await this.markService.create({ mark: dto.mark });
    return this.reviewRepository.create({
      status: dto.status,
      comment: dto.comment,
      markId: mark?.id,
    });
  }

  async delete(id: number) {
    const exists = await this.reviewRepository.existsWithId(id);
    if (!exists)
      throw createError.NotFound(`Review with id ${id} does not exist`);
    await this.reviewRepository.deleteById(id);
    return { message: `Review with id ${id} was deleted successfully` };
  }
}
