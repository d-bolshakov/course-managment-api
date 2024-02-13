import { Expose, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export enum FilterCourseStatus {
  ACTIVE = "active",
  PAST = "past",
  FUTURE = "future",
}

export class FilterCourseDto {
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
  @Type(() => Number)
  teacherId?: number;

  @Expose()
  @IsOptional()
  studentId?: number;

  @Expose()
  @IsOptional()
  @IsEnum(FilterCourseStatus, { message: "Invalid status" })
  readonly status: FilterCourseStatus;
}
