import { AppDataSource } from "../db/data-source";
import { File } from "../entities";
import { writeFile, open, mkdir } from "fs/promises";
import path from "path";
import { UploadedFile } from "express-fileupload";
import { v4 } from "uuid";
import { NotFound, InternalServerError } from "http-errors";

class FileService {
  private fileRepository = AppDataSource.getRepository(File);
  private basePath = path.resolve(__dirname, "..", "static", "attachments");

  async create(file: UploadedFile | UploadedFile[]) {
    if (Array.isArray(file)) return this.createMany(file);
    const ext = "." + file.name.split(".")[1];
    const id = v4();
    try {
      await mkdir(this.basePath, { recursive: true });
      await writeFile(path.join(this.basePath, id + ext), file.data);
    } catch (err) {
      throw InternalServerError(
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
    return this.fileRepository.save(fileEntity);
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
          throw InternalServerError(
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
    return this.fileRepository.save(fileEntities);
  }

  async getOne(id: string) {
    const fileEntity = await this.fileRepository.findOne({ where: { id } });
    if (!fileEntity) throw NotFound(`File with id ${id} does not exist`);
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
