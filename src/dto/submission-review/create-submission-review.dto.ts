import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from "class-validator";
import { SubmissionStatus } from "../../entities";

export class CreateSubmissionReviewDto {
  @IsOptional()
  @IsString({
    message: "comment should be a string",
  })
  readonly comment: string;

  @IsEnum(SubmissionStatus, { message: "Invalid status" })
  @NotEquals(SubmissionStatus.SUBMITTED)
  readonly status: SubmissionStatus;

  // to do: check if status === 'reviewed'
  @IsOptional()
  @IsNumber({}, { message: "mark should be a number" })
  readonly mark: number;
}
