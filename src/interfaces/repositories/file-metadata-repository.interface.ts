import type { CreateFileMetadataDto } from "../../dto/file-metadata/create-file-metadata.dto";
import type { FileMetadataDto } from "../../dto/file-metadata/file-metadata.dto";

export interface IFileMetadataRepository {
  create(
    dto: CreateFileMetadataDto | CreateFileMetadataDto[]
  ): Promise<FileMetadataDto | FileMetadataDto[]>;
  deleteById(id: string): Promise<{ success: boolean }>;
  getById(id: string): Promise<FileMetadataDto | null>;
}
