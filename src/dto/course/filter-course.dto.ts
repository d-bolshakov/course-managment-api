import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

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
  readonly teacherId: number;
}
