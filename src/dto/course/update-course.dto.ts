import {
  IsString,
  IsNumber,
  IsDate,
  MinDate,
  IsOptional,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsAfter } from "../../decorators/IsAfter.decorator.js";

export class UpdateCourseDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "title should be a string",
  })
  readonly title: string;

  @Expose()
  @IsOptional()
  @IsNumber(
    {},
    {
      message: "subjectId should be a number",
    }
  )
  readonly subjectId: number;

  @Expose()
  @IsOptional()
  @IsNumber(
    {},
    {
      message: "maxStudents should be a number",
    }
  )
  readonly maxStudents: number;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: "startsAt should be a date",
  })
  @MinDate(new Date(), {
    message: "startsAt should be later than now",
  })
  readonly startsAt: Date;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: "endsAt should be a date",
  })
  @IsAfter("startsAt", {
    message: "endsAt should be later than now",
  })
  readonly endsAt: Date;
}
