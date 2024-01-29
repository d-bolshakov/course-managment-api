import { AppDataSource } from "../db/data-source.js";
import { writeFile, open, mkdir } from "fs/promises";
import path from "path";
import { UploadedFile } from "express-fileupload";
import { v4 } from "uuid";
import createError from "http-errors";
import { plainToInstance } from "class-transformer";
import { File } from "../entities/File.entity.js";
import { FileDto } from "../dto/file/file.dto.js";
import { fileURLToPath } from "url";

class FileService {
  private fileRepository = AppDataSource.getRepository(File);
  private basePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "static",
    "attachments"
  );

  async create(file: UploadedFile | UploadedFile[]) {
    if (Array.isArray(file)) return this.createMany(file);
    const ext = "." + file.name.split(".")[1];
    const id = v4();
    try {
      await mkdir(this.basePath, { recursive: true });
      await writeFile(path.join(this.basePath, id + ext), file.data);
    } catch (err) {
      throw createError.InternalServerError(
        `Error occured during saving '${file.name}': ${err}`
      );
    }
    const fileEntity = this.fileRepository.create([
      {
        id,
        filename: file.name,
        mimetype: file.mimetype,
      },
    ]);
    await this.fileRepository.save(fileEntity);
    return plainToInstance(FileDto, fileEntity, {
      exposeUnsetFields: false,
    });
  }

  async createMany(files: UploadedFile[]) {
    await mkdir(this.basePath, { recursive: true });
    const fileEntities = await Promise.all(
      files.map(async (file) => {
        const ext = "." + file.name.split(".")[1];
        const id = v4();
        try {
          await writeFile(path.join(this.basePath, id + ext), file.data);
        } catch (err) {
          throw createError.InternalServerError(
            `Error occured during saving '${file.name}': ${err}`
          );
        }
        return this.fileRepository.create({
          id,
          filename: file.name,
          mimetype: file.mimetype,
        });
      })
    );
    await this.fileRepository.save(fileEntities);
    return plainToInstance(FileDto, fileEntities, {
      exposeUnsetFields: false,
    });
  }

  async getOne(id: string) {
    const fileEntity = await this.fileRepository.findOne({ where: { id } });
    if (!fileEntity)
      throw createError.NotFound(`File with id ${id} does not exist`);
    const ext = "." + fileEntity.filename.split(".")[1];
    const fd = await open(path.join(this.basePath, id + ext));
    const stream = fd.createReadStream();
    return {
      filename: fileEntity.filename,
      mimetype: fileEntity.mimetype,
      stream,
    };
  }
}

export const fileService = new FileService();
