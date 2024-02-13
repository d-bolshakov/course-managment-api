import { v4 } from "uuid";
import createError from "http-errors";
import type { IFileService } from "../interfaces/services/file-service.interface.js";
import { CreateFileMetadataDto } from "../dto/file-metadata/create-file-metadata.dto.js";
import type { UploadedFile } from "express-fileupload";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { inject, injectable } from "tsyringe";
import type { IFileMetadataRepository } from "../interfaces/repositories/file-metadata-repository.interface.js";
import type { IFileStorageRepository } from "../interfaces/repositories/file-storage-repository.interface.js";

@injectable()
export class FileService implements IFileService {
  constructor(
    @inject("file-metadata-repository")
    private fileMetadataRepository: IFileMetadataRepository,
    @inject("file-storage-repository")
    private fileStorageRepository: IFileStorageRepository
  ) {}

  async create(file: UploadedFile) {
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

  async createMany(files: UploadedFile[]) {
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
}
