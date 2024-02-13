import path from "path";
import { fileURLToPath } from "url";
import type { UploadedFile } from "express-fileupload";
import { mkdir, open, rm, writeFile, access } from "fs/promises";
import createError from "http-errors";
import type { IFileStorageRepository } from "../interfaces/repositories/file-storage-repository.interface";
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
    try {
      const filePath = path.join(this.basePath, filename);
      await access(filePath);
      const fd = await open(filePath);
      const stream = fd.createReadStream();
      return { stream };
    } catch (err) {
      // @ts-ignore
      if (err.code === "ENOENT")
        throw createError.NotFound(`File with name ${filename} does not exist`);
      throw createError.InternalServerError(
        `Error occured during opening '${filename}': ${err}`
      );
    }
  }

  async deleteByFilename(filename: string) {
    try {
      const filePath = path.join(this.basePath, filename);
      await access(filePath);
      await rm(filePath);
      return { success: true };
    } catch (err) {
      // @ts-ignore
      if (err.code === "ENOENT")
        throw createError.NotFound(`File with name ${filename} does not exist`);
      throw createError.InternalServerError(
        `Error occured during deleting '${filename}': ${err}`
      );
    }
  }
}
