import { v4 } from "uuid";
import createError from "http-errors";
import type { IFileService } from "../interfaces/services/file-service.interface.js";
import { CreateFileMetadataDto } from "../dto/file-metadata/create-file-metadata.dto.js";
import type { UploadedFile } from "express-fileupload";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { inject, injectable } from "tsyringe";
import type { IFileMetadataRepository } from "../interfaces/repositories/file-metadata-repository.interface.js";
import type { IFileStorageRepository } from "../interfaces/repositories/file-storage-repository.interface.js";
import { EventBus } from "../events/event-bus.js";

@injectable()
export class FileService implements IFileService {
  constructor(
    @inject("file-metadata-repository")
    private fileMetadataRepository: IFileMetadataRepository,
    @inject("file-storage-repository")
    private fileStorageRepository: IFileStorageRepository
  ) {
    EventBus.on("file/delete", (id: string | string[]) => this.delete(id));
  }

  async create(file: UploadedFile | UploadedFile[]) {
    if (Array.isArray(file)) return this.createMany(file);
    const originalFilename = file.name;
    const ext = "." + file.name.split(".")[1];
    const id = v4();
    file.name = id + ext;
    await this.fileStorageRepository.create(file);
    const savedRecord = await this.fileMetadataRepository.create({
      id,
      filename: originalFilename,
      mimetype: file.mimetype,
    });
    return savedRecord as FileMetadataDto;
  }

  private async createMany(files: UploadedFile[]) {
    const savedToDisk: CreateFileMetadataDto[] = [];
    for (const file of files) {
      const originalFilename = file.name;
      const ext = "." + file.name.split(".")[1];
      const id = v4();
      file.name = id + ext;
      const { success: isSaved } = await this.fileStorageRepository.create(
        file
      );
      if (isSaved)
        savedToDisk.push({
          id,
          filename: originalFilename,
          mimetype: file.mimetype,
        });
    }
    return this.fileMetadataRepository.create(savedToDisk);
  }

  async getById(id: string) {
    const fileRecord = await this.fileMetadataRepository.getById(id);
    if (!fileRecord)
      throw createError.NotFound(`File with id ${id} does not exist`);
    const ext = "." + fileRecord.filename.split(".")[1];
    const { stream } = await this.fileStorageRepository.getByFilename(id + ext);
    return {
      filename: fileRecord.filename,
      mimetype: fileRecord.mimetype,
      stream,
    };
  }

  async delete(id: string | string[]) {
    if (Array.isArray(id)) return this.deleteMany(id);
    const metadata = await this.fileMetadataRepository.getById(id);
    if (!metadata)
      throw createError.NotFound(
        `Metadata of the file with id ${id} does not exist`
      );
    const filename = id + "." + metadata.filename.split(".")[1];
    const fileExists = await this.fileStorageRepository.existsWithFilename(
      filename
    );
    if (!fileExists)
      throw createError.NotFound(`File with id ${id} does not exist`);
    const { success: isFileDeleted } =
      await this.fileStorageRepository.deleteByFilename(filename);
    if (!isFileDeleted)
      throw createError.InternalServerError(
        `Something went wrong during deleting file ${filename}`
      );
    const { deleted: deletedMetadataId } =
      await this.fileMetadataRepository.deleteById(id);
    if (!deletedMetadataId.length)
      throw createError.InternalServerError(
        `Something went wrong during deleting metadata of file with id ${id}`
      );
    return { deleted: deletedMetadataId };
  }

  private async deleteMany(
    ids: string[]
  ): Promise<{ deleted: { id: string }[] }> {
    const metadata = await this.fileMetadataRepository.getManyById(ids);
    const deletedFromStorage = [];
    for (const record of metadata) {
      const filename = record.id + "." + record.filename.split(".")[1];
      const exists = await this.fileStorageRepository.existsWithFilename(
        filename
      );
      if (!exists)
        throw createError.NotFound(`File with id ${record.id} does not exist`);
      const { success: isDeleted } =
        await this.fileStorageRepository.deleteByFilename(filename);
      if (!isDeleted)
        throw createError.InternalServerError(
          `Something went wrong during deleting file ${filename}`
        );
      deletedFromStorage.push(record.id);
    }
    const { deleted: deletedMetadataIds } =
      await this.fileMetadataRepository.deleteById(deletedFromStorage);
    return { deleted: deletedMetadataIds };
  }
}
