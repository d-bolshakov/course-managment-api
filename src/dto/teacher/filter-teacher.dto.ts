import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FilterTeacherDto {
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
      each: true,
      message: "subjectId should be a number",
    }
  )
  @Type(() => Number)
  readonly subjectId: number[] | number;
}
