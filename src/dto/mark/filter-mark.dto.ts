import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class FilterMarkDto {
  @IsOptional()
  @IsNumber({}, { message: "studentId should be a number" })
  readonly studentId: number;

  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;

  @IsOptional()
  @IsNumber({}, { message: "submissionId should be a number" })
  @Type(() => Number)
  readonly submissionId: number;

  @IsOptional()
  @IsNumber({}, { message: "assignmentId should be a number" })
  @Type(() => Number)
  readonly assignmentId: number;

  @IsOptional()
  @IsNumber({}, { message: "higherThan should be a number" })
  @Type(() => Number)
  readonly higherThan: number;

  @IsOptional()
  @IsNumber({}, { message: "lowerThan should be a number" })
  @Type(() => Number)
  readonly lowerThan: number;
}
