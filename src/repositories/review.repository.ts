import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Review } from "../entities/Review.entity.js";
import { ReviewDto } from "../dto/review/review.dto.js";
import type { IReviewRepository } from "../interfaces/repositories/review-repository.interface.js";
import type { CreateReviewDto } from "../dto/review/create-review.dto.js";
import { injectable } from "tsyringe";

@injectable()
export class ReviewRepository implements IReviewRepository {
  private reviewRepo = AppDataSource.getRepository(Review);

  async create(dto: CreateReviewDto) {
    const review = await this.reviewRepo.save(dto);
    return plainToInstance(ReviewDto, review, {
      exposeUnsetFields: false,
    });
  }
  async deleteById(id: number) {
    try {
      const { affected } = await this.reviewRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getById(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    return plainToInstance(ReviewDto, review, {
      exposeUnsetFields: false,
    });
  }
  async getMany() {
    const [reviews, count] = await this.reviewRepo.findAndCount();
    return {
      reviews: plainToInstance(ReviewDto, reviews, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }
  async existsWithId(id: number) {
    return this.reviewRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }
}
