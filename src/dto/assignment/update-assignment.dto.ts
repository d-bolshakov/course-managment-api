import { IsDate, IsOptional, IsString, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";

export class UpdateAssignmentDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "title should be a string",
  })
  readonly title?: string;

  @Expose()
  @IsOptional()
  @IsString({
    message: "text should be a string",
  })
  readonly text?: string;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: "deadline should be a date",
  })
  @MinDate(new Date(), {
    message: "deadline should be later than now",
  })
  readonly deadline?: Date;
}
