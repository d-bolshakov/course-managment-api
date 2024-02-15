import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MinDate,
} from "class-validator";
import { Expose, Type } from "class-transformer";

export class UpdateAssignmentRequestBodyDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "title should be a string",
  })
  readonly title: string;

  @Expose()
  @IsOptional()
  @IsString({
    message: "text should be a string",
  })
  readonly text: string;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate({
    message: "deadline should be a date",
  })
  @MinDate(new Date(), {
    message: "deadline should be later than now",
  })
  readonly deadline: Date;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      each: true,
      message: "each value in deletedAttachmentIds should be a number",
    }
  )
  readonly deletedAttachmentIds?: number[];
}
