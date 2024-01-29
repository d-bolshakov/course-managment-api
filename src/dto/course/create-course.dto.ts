import { IsString, IsNumber, IsDate, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsAfter } from "../../decorators/IsAfter.decorator.js";

export class CreateCourseDto {
  @Expose()
  @IsString({
    message: "title should be a string",
  })
  readonly title: string;

  @Expose()
  @IsNumber(
    {},
    {
      message: "subjectId should be a number",
    }
  )
  readonly subjectId: number;

  @Expose()
  @IsNumber(
    {},
    {
      message: "maxStudents should be a number",
    }
  )
  readonly maxStudents: number;

  @Expose()
  @Type(() => Date)
  @IsDate({
    message: "startsAt should be a date",
  })
  @MinDate(new Date(), {
    message: "startsAt should be later than now",
  })
  readonly startsAt: Date;

  @Expose()
  @Type(() => Date)
  @IsDate({
    message: "endsAt should be a date",
  })
  @IsAfter("startsAt", {
    message: "endsAt should be later than now",
  })
  readonly endsAt: Date;
}
