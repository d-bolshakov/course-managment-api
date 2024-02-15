import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { File } from "../entities/File.entity.js";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { CreateFileMetadataDto } from "../dto/file-metadata/create-file-metadata.dto.js";
import type { IFileMetadataRepository } from "../interfaces/repositories/file-metadata-repository.interface.js";
import { injectable } from "tsyringe";
import { In } from "typeorm";

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
  async deleteById(id: string | string[]) {
    const qb = this.fileRepo.createQueryBuilder().delete().returning("id");
    if (Array.isArray(id)) qb.whereInIds(id);
    else qb.where("id = :id", { id });
    const { raw } = await qb.execute();
    return { deleted: raw };
  }
  async getById(id: string) {
    const file = await this.fileRepo.findOne({ where: { id } });
    return plainToInstance(FileMetadataDto, file, {
      exposeUnsetFields: false,
    });
  }

  async getManyById(ids: string[]): Promise<FileMetadataDto[]> {
    const files = await this.fileRepo.find({ where: { id: In(ids) } });
    return plainToInstance(FileMetadataDto, files, {
      exposeUnsetFields: false,
    });
  }
}
