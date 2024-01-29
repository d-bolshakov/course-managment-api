import { Expose, Type } from "class-transformer";
import { AssignmentDto } from "../assignment/assignment.dto.js";
import { AttachmentDto } from "../attachment/attachment.dto.js";
import { ReviewDto } from "../review/review.dto.js";
import { StudentDto } from "../student/student.dto.js";

export class SubmissionDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly comment: string;

  @Expose()
  readonly text: string;

  @Expose()
  readonly assignmentId: number;

  @Expose()
  readonly reviewId: number;

  @Expose()
  readonly studentId: number;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => AssignmentDto)
  readonly assignment: () => AssignmentDto;

  @Expose()
  @Type(() => ReviewDto)
  readonly review: () => ReviewDto;

  @Expose()
  @Type(() => StudentDto)
  readonly student: () => StudentDto;

  @Expose()
  @Type(() => AttachmentDto)
  readonly attachments: () => AttachmentDto[];
}
