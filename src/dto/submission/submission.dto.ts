import { Type } from "class-transformer";
import { SubmissionStatus } from "../../entities";

export class SubmissionDto {
  readonly id: number;

  readonly comment: string;

  readonly reviewComment: string;

  readonly text: string;

  readonly status: SubmissionStatus;

  readonly assignmentId: number;

  @Type(() => Date)
  readonly createdAt: Date;
}
