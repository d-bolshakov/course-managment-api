import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { SubmissionStatus } from "../../entities";

export class FilterSubmissionDto {
  @IsOptional()
  @IsEnum(SubmissionStatus, { message: "Invalid status" })
  readonly status: SubmissionStatus;

  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;

  @IsOptional()
  @IsNumber({}, { message: "assaignmentId should be a number" })
  @Type(() => Number)
  readonly assignmentId: number;
}
