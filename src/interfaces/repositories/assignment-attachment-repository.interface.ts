import type { AttachmentDto } from "../../dto/attachment/attachment.dto";
import type { CreateAssignmentAttachmentDto } from "../../dto/attachment/create-assignment-attachment.dto";

export interface IAssignmentAttachmentRepository {
  create(
    dto: CreateAssignmentAttachmentDto | CreateAssignmentAttachmentDto[]
  ): Promise<AttachmentDto | AttachmentDto[]>;
  deleteById(id: number | number[]): Promise<{ deleted: AttachmentDto[] }>;
  getById(id: number): Promise<AttachmentDto | null>;
  getManyById(id: number[]): Promise<AttachmentDto[]>;
}
