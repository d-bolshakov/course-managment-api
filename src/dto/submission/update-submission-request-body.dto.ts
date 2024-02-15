import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSubmissionRequestBodyDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "comment should be a string",
  })
  readonly comment?: string;

  @Expose()
  @IsOptional()
  @IsString({
    message: "text should be a string",
  })
  readonly text?: string;

  @Expose()
  @IsOptional()
  @IsNumber(
    {},
    {
      each: true,
      message: "each value in deletedAttachmentIds should be a number",
    }
  )
  @Type(() => Number)
  readonly deletedAttachmentIds?: number[];
}
