import { IsNumber, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";

export class FilterMarkDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "studentId should be a number" })
  readonly studentId: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "submissionId should be a number" })
  @Type(() => Number)
  readonly submissionId: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "assignmentId should be a number" })
  @Type(() => Number)
  readonly assignmentId: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "higherThan should be a number" })
  @Type(() => Number)
  readonly higherThan: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "lowerThan should be a number" })
  @Type(() => Number)
  readonly lowerThan: number;
}
