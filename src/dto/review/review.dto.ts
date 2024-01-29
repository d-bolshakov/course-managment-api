import { Expose, Type } from "class-transformer";
import { MarkDto } from "../mark/mark.dto.js";
import { SubmissionDto } from "../submission/submission.dto.js";

export class ReviewDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly status: string;

  @Expose()
  readonly comment: string;

  @Expose()
  readonly markId: number;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => MarkDto)
  readonly mark: MarkDto;

  @Expose()
  @Type(() => SubmissionDto)
  readonly submission: () => SubmissionDto;
}
