import { Expose, Type } from "class-transformer";
import { AssignmentDto } from "../assignment/assignment.dto.js";
import { FileMetadataDto } from "../file-metadata/file-metadata.dto.js";
import { SubmissionDto } from "../submission/submission.dto.js";

export class AttachmentDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly assignmentId: number;

  @Expose()
  readonly submissionId: number;

  @Expose()
  readonly fileId: string;

  @Expose()
  @Type(() => AssignmentDto)
  readonly assignment: () => AssignmentDto;

  @Expose()
  @Type(() => SubmissionDto)
  readonly submission: () => SubmissionDto;

  @Expose()
  @Type(() => FileMetadataDto)
  readonly file: FileMetadataDto;
}
