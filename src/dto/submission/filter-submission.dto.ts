import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";

export enum FilterSubmissionstatus {
  SUMBITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export class FilterSubmissionDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "assignmentId should be a number" })
  @Type(() => Number)
  readonly assignmentId: number;

  @Expose()
  @IsOptional()
  @IsEnum(FilterSubmissionstatus, { message: "invalid status" })
  readonly status: FilterSubmissionstatus;
}
