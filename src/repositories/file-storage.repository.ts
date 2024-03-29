import path from "path";
import { fileURLToPath } from "url";
import type { UploadedFile } from "express-fileupload";
import { mkdir, open, rm, writeFile, access } from "fs/promises";
import type { IFileStorageRepository } from "./interfaces/file-storage-repository.interface";
import { injectable } from "tsyringe";

@injectable()
export class FileStorageRepository implements IFileStorageRepository {
  private basePath;
  constructor() {
    this.basePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      "static",
      "attachments"
    );
  }

  async create(file: UploadedFile) {
    try {
      await mkdir(this.basePath, { recursive: true });
      await writeFile(path.join(this.basePath, file.name), file.data);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }

  async getByFilename(filename: string) {
    const filePath = path.join(this.basePath, filename);
    await access(filePath);
    const fd = await open(filePath);
    const stream = fd.createReadStream();
    return { stream };
  }

  async deleteByFilename(filename: string) {
    try {
      const filePath = path.join(this.basePath, filename);
      await access(filePath);
      await rm(filePath);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }

  async existsWithFilename(filename: string) {
    try {
      const filePath = path.join(this.basePath, filename);
      await access(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }
}
