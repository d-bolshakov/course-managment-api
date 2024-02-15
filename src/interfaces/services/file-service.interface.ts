import type { UploadedFile } from "express-fileupload";
import { FileMetadataDto } from "../../dto/file-metadata/file-metadata.dto.js";
import { ReadStream } from "fs";

export interface IFileService {
  create(
    file: UploadedFile | UploadedFile[]
  ): Promise<FileMetadataDto | FileMetadataDto[]>;
  getById(
    id: string
  ): Promise<{ filename: string; mimetype: string; stream: ReadStream }>;
  delete(id: string | string[]): Promise<{ deleted: { id: string }[] }>;
}
