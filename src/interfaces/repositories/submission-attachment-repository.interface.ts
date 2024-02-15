import type { AttachmentDto } from "../../dto/attachment/attachment.dto";
import type { CreateSubmissionAttachmentDto } from "../../dto/attachment/create-submission-attachment.dto";

export interface ISubmissionAttachmentRepository {
  create(
    dto: CreateSubmissionAttachmentDto | CreateSubmissionAttachmentDto[]
  ): Promise<AttachmentDto | AttachmentDto[]>;
  deleteById(id: number | number[]): Promise<{ deleted: AttachmentDto[] }>;
  getById(id: number): Promise<AttachmentDto | null>;
  getManyById(id: number[]): Promise<AttachmentDto[]>;
}
