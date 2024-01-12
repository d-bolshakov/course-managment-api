import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FilterTeacherDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly page: number;

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
