import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Mark } from "../db/entities/Mark.entity.js";
import { MarkDto } from "../dto/mark/mark.dto.js";
import { CreateMarkDto } from "../dto/mark/create-mark.dto.js";
import type { IMarkRepository } from "./interfaces/mark-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class MarkRepository implements IMarkRepository {
  private markRepo = AppDataSource.getRepository(Mark);

  async create(dto: CreateMarkDto) {
    const mark = await this.markRepo.save(dto);
    return plainToInstance(MarkDto, mark, {
      exposeUnsetFields: false,
    });
  }

  async deleteById(id: number) {
    try {
      const { affected } = await this.markRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async getById(id: number) {
    const mark = await this.markRepo.findOne({ where: { id } });
    return plainToInstance(MarkDto, mark, {
      exposeUnsetFields: false,
    });
  }

  async getMany() {
    const [marks, count] = await this.markRepo.findAndCount();
    return {
      marks: plainToInstance(MarkDto, marks, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  existsWithId(id: number) {
    return this.markRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }
}
