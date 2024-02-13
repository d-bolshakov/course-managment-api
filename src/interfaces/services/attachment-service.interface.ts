import type { UploadedFile } from "express-fileupload";
import { AttachmentDto } from "../../dto/attachment/attachment.dto";

export interface IAttachmentService {
  create(
    parentId: number,
    file: UploadedFile | UploadedFile[]
  ): Promise<AttachmentDto | AttachmentDto[]>;

  delete(id: number): Promise<any>;
}
