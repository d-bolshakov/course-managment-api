import { Expose, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export enum FilterTeacherCourseStatus {
  ACTIVE = "active",
  PAST = "past",
  FUTURE = "future",
}

export class FilterTeacherCourseDto {
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
  @IsEnum(FilterTeacherCourseStatus, { message: "Invalid status" })
  readonly status: FilterTeacherCourseStatus;
}
