import { Expose, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { FilterTeacherCourseStatus } from "./filter-teacher-course.dto.js";

export class FilterStudentCourseDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsNumber(
    {},
    {
      message: "subjectId should be a number",
    }
  )
  @Type(() => Number)
  readonly subjectId: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "teacherId should be a number" })
  readonly teacherId: number;

  @Expose()
  @IsOptional()
  @IsEnum(FilterTeacherCourseStatus, { message: "Invalid status" })
  readonly status: FilterTeacherCourseStatus;
}
