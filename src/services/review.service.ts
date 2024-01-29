import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { markService } from "./mark.service.js";
import { plainToInstance } from "class-transformer";
import { CreateReviewDto } from "../dto/review/create-review.dto.js";
import { ReviewDto } from "../dto/review/review.dto.js";
import { Review, ReviewStatus } from "../entities/Review.entity.js";
import { FindOptionsWhere } from "typeorm";

class ReviewService {
  private reviewRepository = AppDataSource.getRepository(Review);

  async create(dto: CreateReviewDto) {
    const review = new Review();
    review.status = dto.status;
    review.comment = dto.comment;
    if (dto.status === ReviewStatus.ACCEPTED)
      review.markId = (await markService.create({ mark: dto.mark })).id;
    await this.reviewRepository.save(review);
    return plainToInstance(ReviewDto, review, {
      exposeUnsetFields: false,
    });
  }

  async getMany(options: { filters: any }) {
    const conditions: FindOptionsWhere<Review> = {};
    const reviews = await this.reviewRepository.find({
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(ReviewDto, reviews, {
      exposeUnsetFields: false,
    });
  }

  async delete(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review)
      throw new createError.NotFound(`Review with id ${id} does not exist`);
    await this.reviewRepository.remove(review);
    return { message: `Review with id ${id} was deleted successfully` };
  }
}

export const reviewService = new ReviewService();
