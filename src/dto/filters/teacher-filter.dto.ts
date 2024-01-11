import { Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class TeacherFilterDto {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @Expose()
  @IsNumber(
    {},
    {
      each: true,
      message: "subjectId should be a number",
    }
  )
  @Type(() => Number)
  subjectId: number[] | number;
}
