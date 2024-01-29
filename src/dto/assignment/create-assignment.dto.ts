import { IsDate, IsNumber, IsString, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";

export class CreateAssignmentDto {
  @Expose()
  @IsNumber(
    {},
    {
      message: "courseId should be a number",
    }
  )
  @Type(() => Number)
  readonly courseId: number;

  @Expose()
  @IsString({
    message: "title should be a string",
  })
  readonly title: string;

  @Expose()
  @IsString({
    message: "text should be a string",
  })
  readonly text: string;

  @Expose()
  @Type(() => Date)
  @IsDate({
    message: "deadline should be a date",
  })
  @MinDate(new Date(), {
    message: "deadline should be later than now",
  })
  readonly deadline: Date;
}
