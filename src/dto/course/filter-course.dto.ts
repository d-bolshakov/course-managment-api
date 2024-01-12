import { Type } from "class-transformer";
import { IsNumber, IsDate, IsBoolean, IsOptional } from "class-validator";
import { IsAfterNow, IsAfter } from "../../decorators";

export class FilterCourseDto {
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: "subject should be a number",
    }
  )
  @Type(() => Number)
  readonly subjectId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly teacherId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly minStudents: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsAfterNow({
    message: "startsAfter can't be before now",
  })
  readonly startsAfter: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsAfter("startsAfter", {
    message: "startsBefore can't be before startsAfter",
  })
  @IsAfterNow({
    message: "startsBefore can't be before now",
  })
  readonly startsBefore: Date;

  @IsOptional()
  @IsBoolean({ message: "started should be a boolean" })
  readonly started: boolean;

  @IsOptional()
  @IsBoolean({ message: "available should be a boolean" })
  readonly available: boolean;
}
