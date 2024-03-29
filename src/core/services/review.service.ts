import createError from "http-errors";
import { ReviewSubmissionDto } from "../../dto/submission/review-submission.dto.js";
import { ReviewStatus } from "../../db/entities/Review.entity.js";
import type { IReviewService } from "./interfaces/review-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { IReviewRepository } from "../../repositories/interfaces/review-repository.interface.js";
import type { IMarkService } from "./interfaces/mark-service.interface.js";

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
    const result = await this.reviewRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleting review with id ${id}`
      );
    return result;
  }
}
