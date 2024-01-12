import { IsDate, IsNumber, IsString, MinDate } from "class-validator";
import { Type } from "class-transformer";

export class CreateAssignmentDto {
  @IsString({
    message: "title should be a string",
  })
  readonly title: string;

  @IsString({
    message: "text should be a string",
  })
  readonly text: string;

  @Type(() => Date)
  @IsDate({
    message: "deadline should be a date",
  })
  @MinDate(new Date(), {
    message: "deadline should be later than now",
  })
  readonly deadline: Date;
}
