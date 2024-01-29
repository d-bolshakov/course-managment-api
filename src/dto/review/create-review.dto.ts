import { Expose, Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidationError,
} from "class-validator";
import { ReviewStatus } from "../../entities/Review.entity.js";

export class CreateReviewDto {
  @Expose()
  @IsEnum(ReviewStatus, { message: "Invalid status" })
  readonly status: ReviewStatus;

  @Expose()
  @IsOptional()
  @IsString({
    message: "comment should be a string",
  })
  readonly comment: string;

  @Expose()
  @Transform(({ value, obj, options }) =>
    obj.status !== ReviewStatus.REJECTED ? value : undefined
  )
  @ValidateIf((obj: any, value: any) => obj.status !== ReviewStatus.REJECTED)
  @IsNumber({}, { message: "mark should be a number" })
  readonly mark: number;
}
