import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Subject } from "../db/entities/Subject.entity.js";
import { SubjectDto } from "../dto/subject/subject.dto.js";
import { In } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { UpdateSubjectDto } from "../dto/subject/update-subject.dto.js";
import type { ISubjectRepository } from "./interfaces/subject-repository.interface.js";
import { injectable } from "tsyringe";
import type { FilterSubjectDto } from "../dto/subject/filter-subject.dto.js";

@injectable()
export class SubjectRepository implements ISubjectRepository {
  private subjectRepo = AppDataSource.getRepository(Subject);

  async create(item: Partial<Subject>) {
    const subject = await this.subjectRepo.save(item);
    return plainToInstance(SubjectDto, subject, { exposeUnsetFields: false });
  }

  async updateById(id: number, updateDto: UpdateSubjectDto) {
    try {
      const { affected } = await this.subjectRepo.update({ id }, updateDto);
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async deleteById(id: number) {
    try {
      const { affected } = await this.subjectRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async getById(id: number) {
    const subject = await this.subjectRepo.findOne({ where: { id } });
    return plainToInstance(SubjectDto, subject, { exposeUnsetFields: false });
  }

  async getByTitle(title: string) {
    const subject = await this.subjectRepo.findOne({ where: { title } });
    return plainToInstance(SubjectDto, subject, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: FilterSubjectDto) {
    const [subjects, count] = await this.subjectRepo.findAndCount({
      take: 10,
      skip: getPaginationOffset(filters?.page || 1),
    });
    return {
      subjects: plainToInstance(SubjectDto, subjects, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  async getManyByIds(ids: number[]) {
    const subjects = await this.subjectRepo.find({
      where: {
        id: In(ids),
      },
    });
    return plainToInstance(SubjectDto, subjects, {
      exposeUnsetFields: false,
    });
  }

  existsWithId(id: number | number[]) {
    const qb = this.subjectRepo.createQueryBuilder();
    if (Array.isArray(id)) qb.whereInIds(id);
    else qb.where("id = :id", { id });
    return qb.getExists();
  }
}
