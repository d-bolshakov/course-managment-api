import { IsNumber } from "class-validator";
import { Expose, Type } from "class-transformer";

export class MarkFilterDto {
  @Expose()
  @IsNumber({}, { message: "studentId should be a number" })
  studentId: number;

  @Expose()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  courseId: number;

  @Expose()
  @IsNumber({}, { message: "submissionId should be a number" })
  @Type(() => Number)
  submissionId: number;

  @Expose()
  @IsNumber({}, { message: "assignmentId should be a number" })
  @Type(() => Number)
  assignmentId: number;

  @Expose()
  @IsNumber({}, { message: "higherThan should be a number" })
  @Type(() => Number)
  higherThan: number;

  @Expose()
  @IsNumber({}, { message: "lowerThan should be a number" })
  @Type(() => Number)
  lowerThan: number;
}
