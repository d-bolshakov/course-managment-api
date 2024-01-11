import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Subject } from "../entities/";
import { SubjectDto } from "../dto/subject.dto";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";

class SubjectService {
  private subjectRepository = AppDataSource.getRepository(Subject);

  async create(dto: SubjectDto) {
    const candidate = await this.getByTitle(dto.title);
    if (candidate) {
      throw BadRequest(`Subject with title ${dto.title} already exists`);
    }
    const subject = this.subjectRepository.create(dto as Partial<Subject>);
    return this.subjectRepository.save(subject);
  }

  async getOne(
    conditions: FindOptionsWhere<Subject>,
    options?: { relations?: FindOptionsRelations<Subject> }
  ) {
    return this.subjectRepository.findOne({
      where: conditions,
      relations: options?.relations,
    });
  }

  async getMany(options?: {
    conditions?: FindOptionsWhere<Subject>;
    relations?: FindOptionsRelations<Subject>;
    page?: number;
  }) {
    const findOptions: FindManyOptions<Subject> = {
      where: options?.conditions,
      relations: options?.relations,
    };
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);
    return this.subjectRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: { relations?: FindOptionsRelations<Subject> }
  ) {
    const subject = await this.getOne({ id }, options);
    if (!subject) throw BadRequest(`Subject with id ${id} does not exist`);
    return subject;
  }

  async getByTitle(title: string) {
    return this.getOne({ title });
  }

  async update(id: number, dto: SubjectDto) {
    const subject = await this.getById(id);
    return this.subjectRepository.save({
      ...subject,
      ...dto,
    });
  }

  async delete(id: number) {
    const subject = await this.getById(id);
    await this.subjectRepository.remove(subject);
    return { message: `Subject with id  ${id} was deleted successfully` };
  }
}

export const subjectService = new SubjectService();
