import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { In } from "typeorm";
import { CreateSubjectDto } from "../dto/subject/create-subject.dto.js";
import { SubjectDto } from "../dto/subject/subject.dto.js";
import { UpdateSubjectDto } from "../dto/subject/update-subject.dto.js";
import { Subject } from "../entities/Subject.entity.js";
import { plainToInstance } from "class-transformer";

class SubjectService {
  private subjectRepository = AppDataSource.getRepository(Subject);

  async create(dto: CreateSubjectDto) {
    const candidate = await this.getByTitle(dto.title);
    if (candidate) {
      throw createError.BadRequest(
        `Subject with title ${dto.title} already exists`
      );
    }
    const subject = this.subjectRepository.create(dto as Partial<Subject>);
    await this.subjectRepository.save(subject);
    return plainToInstance(SubjectDto, subject, {
      exposeUnsetFields: false,
    });
  }

  async getMany(options?: { filters?: { page: number } }) {
    const subjects = await this.subjectRepository.find({
      take: 10,
      skip: getPaginationOffset(options?.filters?.page || 1),
    });
    return plainToInstance(SubjectDto, subjects, {
      exposeUnsetFields: false,
    });
  }

  async getManyByIds(ids: number[]) {
    const subjects = await this.subjectRepository.find({
      where: {
        id: In(ids),
      },
    });
    return plainToInstance(SubjectDto, subjects, {
      exposeUnsetFields: false,
    });
  }

  async getById(id: number) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject)
      throw createError.NotFound(`Subject with id ${id} does not exist`);
    return plainToInstance(SubjectDto, subject, {
      exposeUnsetFields: false,
    });
  }

  async getByTitle(title: string) {
    const subject = await this.subjectRepository.findOne({ where: { title } });
    return plainToInstance(SubjectDto, subject, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: UpdateSubjectDto) {
    if (!(await this.exists(id)))
      throw createError.NotFound(`Subject with id ${id} does not exist`);
    return this.subjectRepository.update(
      { id },
      {
        ...dto,
      }
    );
  }

  async delete(id: number) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject)
      throw createError.NotFound(`Subject with id ${id} does not exist`);
    await this.subjectRepository.remove(subject);
    return { message: `Subject with id  ${id} was deleted successfully` };
  }

  async exists(id: number | number[]) {
    const qb = this.subjectRepository.createQueryBuilder();
    if (Array.isArray(id)) qb.whereInIds(id);
    else qb.where("id = :id", { id });
    return qb.getExists();
  }
}

export const subjectService = new SubjectService();
