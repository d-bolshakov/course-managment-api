import { Expose, Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import { ReviewStatus } from "../../db/entities/Review.entity.js";

export class ReviewSubmissionDto {
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
