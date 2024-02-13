import type { UploadedFile } from "express-fileupload";
import type { IAttachmentService } from "../interfaces/services/attachment-service.interface.js";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { inject, injectable } from "tsyringe";
import type { IAssignmentAttachmentRepository } from "../interfaces/repositories/assignment-attachment-repository.interface.js";
import type { IFileService } from "../interfaces/services/file-service.interface.js";

@injectable()
export class AssignmentAttachmentService implements IAttachmentService {
  constructor(
    @inject("assignment-attachment-repository")
    private assignmentAttachmentRepository: IAssignmentAttachmentRepository,
    @inject("file-service")
    private fileService: IFileService
  ) {}

  async create(assignmentId: number, file: UploadedFile | UploadedFile[]) {
    if (Array.isArray(file)) {
      console.log(file);
      const fileMetadata = (await this.fileService.createMany(
        file
      )) as FileMetadataDto[];
      return this.assignmentAttachmentRepository.create(
        fileMetadata.map((f) => ({ assignmentId, fileId: f.id }))
      );
    } else {
      const fileMetadata = await this.fileService.create(file);
      return this.assignmentAttachmentRepository.create({
        assignmentId,
        fileId: fileMetadata.id,
      });
    }
  }

  async delete(id: number) {}
}
