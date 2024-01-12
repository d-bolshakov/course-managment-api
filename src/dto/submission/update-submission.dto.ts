import { IsOptional, IsString } from "class-validator";

export class UpdateSubmissionDto {
  @IsOptional()
  @IsString({
    message: "comment should be a string",
  })
  readonly comment: string;

  @IsOptional()
  @IsString({
    message: "text should be a string",
  })
  readonly text: string;
}
