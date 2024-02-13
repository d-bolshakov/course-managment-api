import type { AttachmentDto } from "../../dto/attachment/attachment.dto";
import type { CreateAssignmentAttachmentDto } from "../../dto/attachment/create-assignment-attachment.dto";

export interface IAssignmentAttachmentRepository {
  create(
    dto: CreateAssignmentAttachmentDto | CreateAssignmentAttachmentDto[]
  ): Promise<AttachmentDto | AttachmentDto[]>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<AttachmentDto | null>;
}
