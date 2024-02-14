import createError from "http-errors";
import { CreateSubjectDto } from "../dto/subject/create-subject.dto.js";
import { UpdateSubjectDto } from "../dto/subject/update-subject.dto.js";
import type { ISubjectService } from "../interfaces/services/subject-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { ISubjectRepository } from "../interfaces/repositories/subject-repository.interface.js";
import type { FilterSubjectDto } from "../dto/subject/filter-subject.dto.js";

@injectable()
export class SubjectService implements ISubjectService {
  constructor(
    @inject("subject-repository") private subjectRepository: ISubjectRepository
  ) {}

  async create(dto: CreateSubjectDto) {
    const candidate = await this.subjectRepository.getByTitle(dto.title);
    if (candidate) {
      throw createError.BadRequest(
        `Subject with title ${dto.title} already exists`
      );
    }
    const subject = await this.subjectRepository.create(dto);
    return subject;
  }

  async getMany(options?: { filters?: FilterSubjectDto }) {
    return this.subjectRepository.getMany(options?.filters);
  }

  async getById(id: number) {
    const subject = await this.subjectRepository.getById(id);
    if (!subject)
      throw createError.NotFound(`Subject with id ${id} does not exist`);
    return subject;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    if (!(await this.subjectRepository.existsWithId(id)))
      throw createError.NotFound(`Subject with id ${id} does not exist`);
    const { success: isUpdated } = await this.subjectRepository.updateById(id, {
      ...dto,
    });
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during updating subject with id ${id}`
      );
    return this.subjectRepository.getById(id);
  }

  async delete(id: number) {
    const subject = await this.subjectRepository.existsWithId(id);
    if (!subject)
      throw createError.NotFound(`Subject with id ${id} does not exist`);
    const result = await this.subjectRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleteding subject with id ${id}`
      );
    return result;
  }
}
