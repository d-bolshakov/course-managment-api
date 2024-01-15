import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class FilterSubmissionDto {
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;

  @IsOptional()
  @IsNumber({}, { message: "assaignmentId should be a number" })
  @Type(() => Number)
  readonly assignmentId: number;
}
