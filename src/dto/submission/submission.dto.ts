import { Type } from "class-transformer";

export class SubmissionDto {
  readonly id: number;

  readonly comment: string;

  readonly text: string;

  readonly assignmentId: number;

  @Type(() => Date)
  readonly createdAt: Date;
}
