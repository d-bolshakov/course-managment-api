import { Expose, Type } from "class-transformer";
import { IsNumber, IsDate } from "class-validator";
import { IsAfterNow, IsAfter } from "../decorators/";

export class CourseFilterDto {
  @Expose()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  page: number;

  @Expose()
  @IsNumber(
    {},
    {
      message: "subject should be a number",
    }
  )
  @Type(() => Number)
  subject: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  teacher: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  minStudents: number;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsAfterNow({
    message: "startsAfter can't be before now",
  })
  startsAfter: Date;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsAfter("startsAfter", {
    message: "startsBefore can't be before startsAfter",
  })
  @IsAfterNow({
    message: "startsBefore can't be before now",
  })
  startsBefore: Date;
}
