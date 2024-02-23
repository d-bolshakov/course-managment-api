import type { UploadedFile } from "express-fileupload";
import type { IAttachmentService } from "./interfaces/attachment-service.interface.js";
import { FileMetadataDto } from "../../dto/file-metadata/file-metadata.dto.js";
import { inject, injectable } from "tsyringe";
import type { IAssignmentAttachmentRepository } from "../../repositories/interfaces/assignment-attachment-repository.interface.js";
import type { IFileService } from "./interfaces/file-service.interface.js";
import createError from "http-errors";
import { EventBus } from "../../events/event-bus.js";

@injectable()
export class AssignmentAttachmentService implements IAttachmentService {
  constructor(
    @inject("assignment-attachment-repository")
    private assignmentAttachmentRepository: IAssignmentAttachmentRepository,
    @inject("file-service")
    private fileService: IFileService
  ) {}

  async create(assignmentId: number, file: UploadedFile | UploadedFile[]) {
    if (Array.isArray(file)) return this.createMany(assignmentId, file);
    const fileMetadata = (await this.fileService.create(
      file
    )) as FileMetadataDto;
    return this.assignmentAttachmentRepository.create({
      assignmentId,
      fileId: fileMetadata.id,
    });
  }

  private async createMany(assignmentId: number, file: UploadedFile[]) {
    const fileMetadata = (await this.fileService.create(
      file
    )) as FileMetadataDto[];
    return this.assignmentAttachmentRepository.create(
      fileMetadata.map((f) => ({ assignmentId, fileId: f.id }))
    );
  }

  async delete(id: number | number[]) {
    if (Array.isArray(id)) return this.deleteMany(id);
    const attachment = await this.assignmentAttachmentRepository.getById(id);
    if (!attachment)
      throw createError.NotFound(`Attachment with id ${id} does not exist`);
    const { deleted } = await this.assignmentAttachmentRepository.deleteById(
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
    const attachments = await this.assignmentAttachmentRepository.getManyById(
      ids
    );
    const { deleted } = await this.assignmentAttachmentRepository.deleteById(
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
