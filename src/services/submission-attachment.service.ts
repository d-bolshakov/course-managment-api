import type { UploadedFile } from "express-fileupload";
import type { IAttachmentService } from "../interfaces/services/attachment-service.interface.js";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { inject, injectable } from "tsyringe";
import type { ISubmissionAttachmentRepository } from "../interfaces/repositories/submission-attachment-repository.interface.js";
import type { IFileService } from "../interfaces/services/file-service.interface.js";
import createError from "http-errors";
import { EventBus } from "../events/event-bus.js";

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
      const fileMetadata = (await this.fileService.create(
        file
      )) as FileMetadataDto[];
      return this.submissionAttachmentRepository.create(
        fileMetadata.map((f) => ({ submissionId, fileId: f.id }))
      );
    } else {
      const fileMetadata = (await this.fileService.create(
        file
      )) as FileMetadataDto;
      return this.submissionAttachmentRepository.create({
        submissionId,
        fileId: fileMetadata.id,
      });
    }
  }

  async delete(id: number | number[]) {
    if (Array.isArray(id)) return this.deleteMany(id);
    const attachment = await this.submissionAttachmentRepository.getById(id);
    if (!attachment)
      throw createError.NotFound(`Attachment with id ${id} does not exist`);
    const { deleted } = await this.submissionAttachmentRepository.deleteById(
      id
    );
    if (!deleted.length)
      throw createError.InternalServerError(
        `Something went wrong during deleting attachment with id ${id}`
      );
    EventBus.emit("file/delete", deleted[0].fileId);
    return { deleted: [deleted[0].id] };
  }

  private async deleteMany(ids: number[]) {
    const attachments = await this.submissionAttachmentRepository.getManyById(
      ids
    );
    const { deleted } = await this.submissionAttachmentRepository.deleteById(
      attachments.map((a) => a.id)
    );
    EventBus.emit(
      "file/delete",
      deleted.map((d) => d.fileId)
    );
    return { deleted: deleted.map((a) => a.id) };
  }

  async update(
    assignmentId: number,
    dto: { deletedIds?: number[]; new?: UploadedFile | UploadedFile[] }
  ) {
    let deleted: number[] = [];
    let created: number[] = [];
    if (dto.deletedIds?.length) {
      const { deleted: deletedIds } = await this.delete(dto.deletedIds);
      deleted = deletedIds;
    }
    if (dto.new) {
      const createdAttachments = await this.create(assignmentId, dto.new);
      created = Array.isArray(createdAttachments)
        ? createdAttachments.map((a) => a.id)
        : [createdAttachments.id];
    }
    return { deleted, created };
  }
}
