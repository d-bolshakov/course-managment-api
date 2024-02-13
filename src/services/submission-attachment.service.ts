import type { UploadedFile } from "express-fileupload";
import type { IAttachmentService } from "../interfaces/services/attachment-service.interface.js";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { inject, injectable } from "tsyringe";
import type { ISubmissionAttachmentRepository } from "../interfaces/repositories/submission-attachment-repository.interface.js";
import type { IFileService } from "../interfaces/services/file-service.interface.js";

@injectable()
export class SubmissionAttachmentService implements IAttachmentService {
  constructor(
    @inject("submission-attachment-repository")
    private submissionAttachmentRepository: ISubmissionAttachmentRepository,
    @inject("file-service")
    private fileService: IFileService
  ) {}

  async create(submissionId: number, file: UploadedFile | UploadedFile[]) {
    if (Array.isArray(file)) {
      const fileMetadata = (await this.fileService.createMany(
        file
      )) as FileMetadataDto[];
      return this.submissionAttachmentRepository.create(
        fileMetadata.map((f) => ({ submissionId, fileId: f.id }))
      );
    } else {
      const fileMetadata = await this.fileService.create(file);
      return this.submissionAttachmentRepository.create({
        submissionId,
        fileId: fileMetadata.id,
      });
    }
  }

  async delete(id: number) {}
}
