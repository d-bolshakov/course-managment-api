import {
  IsString,
  IsNumber,
  IsDate,
  MinDate,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { IsAfter } from "../../decorators";

export class UpdateCourseDto {
  @IsOptional()
  @IsString({
    message: "title should be a string",
  })
  readonly title: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: "subjectId should be a number",
    }
  )
  readonly subjectId: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: "maxStudents should be a number",
    }
  )
  readonly maxStudents: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: "startsAt should be a date",
  })
  @MinDate(new Date(), {
    message: "startsAt should be later than now",
  })
  readonly startsAt: Date;

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
