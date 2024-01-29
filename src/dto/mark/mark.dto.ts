import { Expose, Type } from "class-transformer";
import { ReviewDto } from "../review/review.dto.js";

export class MarkDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly mark: number;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => ReviewDto)
  readonly review: () => ReviewDto;
}
