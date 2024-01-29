import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class UpdateSubmissionDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "comment should be a string",
  })
  readonly comment: string;

  @Expose()
  @IsOptional()
  @IsString({
    message: "text should be a string",
  })
  readonly text: string;
}
