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
      message: "subject should be a number",
    }
  )
  @Type(() => Number)
  subject: number[];
}
