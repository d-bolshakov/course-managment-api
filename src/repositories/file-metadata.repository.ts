import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { File } from "../entities/File.entity.js";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { CreateFileMetadataDto } from "../dto/file-metadata/create-file-metadata.dto.js";
import type { IFileMetadataRepository } from "../interfaces/repositories/file-metadata-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class FileMetadataRepository implements IFileMetadataRepository {
  private fileRepo = AppDataSource.getRepository(File);

  async create(dto: CreateFileMetadataDto | CreateFileMetadataDto[]) {
    // @ts-expect-error
    const file = await this.fileRepo.save(dto);
    return plainToInstance(FileMetadataDto, file, {
      exposeUnsetFields: false,
    });
  }
  async deleteById(id: string) {
    try {
      const { affected } = await this.fileRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getById(id: string) {
    const file = await this.fileRepo.findOne({ where: { id } });
    return plainToInstance(FileMetadataDto, file, {
      exposeUnsetFields: false,
    });
  }
}
