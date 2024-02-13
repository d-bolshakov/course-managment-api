import type { UploadedFile } from "express-fileupload";
import type { ReadStream } from "fs";

export interface IFileStorageRepository {
  create(file: UploadedFile): Promise<{ success: boolean }>;
  getByFilename(filename: string): Promise<{ stream: ReadStream }>;
  deleteByFilename(filename: string): Promise<{ success: boolean }>;
}
