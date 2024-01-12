import { IsString } from "class-validator";

export class CreateSubmissionDto {
  @IsString({
    message: "comment should be a string",
  })
  readonly comment: string;

  @IsString({
    message: "text should be a string",
  })
  readonly text: string;
}
