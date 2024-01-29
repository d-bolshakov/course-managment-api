import { Expose, Type } from "class-transformer";
import { CourseDto } from "../course/course.dto.js";
import { AttachmentDto } from "../attachment/attachment.dto.js";
import { SubmissionDto } from "../submission/submission.dto.js";

export class AssignmentDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly text: string;

  @Expose()
  @Type(() => Date)
  readonly deadline: Date;

  @Expose()
  readonly courseId: number;

  @Expose()
  @Type(() => CourseDto)
  readonly course: () => CourseDto;

  @Expose()
  @Type(() => AttachmentDto)
  readonly attachments: AttachmentDto[];

  @Expose()
  @Type(() => SubmissionDto)
  readonly submissions: SubmissionDto[];

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;
}
