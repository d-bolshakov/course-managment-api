import type { UploadedFile } from "express-fileupload";
import { AttachmentDto } from "../../../dto/attachment/attachment.dto";

export interface IAttachmentService {
  create(
    parentId: number,
    file: UploadedFile | UploadedFile[]
  ): Promise<AttachmentDto | AttachmentDto[]>;

  update(
    parentId: number,
    dto: { deletedIds?: number[]; new?: UploadedFile | UploadedFile[] }
  ): Promise<{ deleted: number[]; created: number[] }>;

  delete(id: number | number[]): Promise<{ deleted: number[] }>;
}
