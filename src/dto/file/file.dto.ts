import { Expose, Type } from "class-transformer";
import { AttachmentDto } from "../attachment/attachment.dto.js";

export class FileDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly filename: string;

  @Expose()
  readonly mimetype: string;

  @Expose()
  @Type(() => Date)
  readonly createdAt: Date;

  @Expose()
  @Type(() => AttachmentDto)
  readonly submissionAttachment: () => AttachmentDto;

  @Expose()
  @Type(() => AttachmentDto)
  readonly assignmentAttachment: () => AttachmentDto;
}
