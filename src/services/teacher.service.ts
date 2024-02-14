import createError from "http-errors";
import { plainToInstance } from "class-transformer";
import { CreateTeacherDto } from "../dto/teacher/create-teacher.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { TeacherDto } from "../dto/teacher/teacher.dto.js";
import { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import type { ITeacherService } from "../interfaces/services/teacher-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { ITeacherRepository } from "../interfaces/repositories/teacher-repository.interface.js";
import type { ISubjectRepository } from "../interfaces/repositories/subject-repository.interface.js";

@injectable()
export class TeacherService implements ITeacherService {
  constructor(
    @inject("teacher-repository") private teacherRepository: ITeacherRepository,
    @inject("subject-repository") private subjectRepository: ISubjectRepository
  ) {}

  async create(dto: CreateTeacherDto) {
    const subjects = await this.subjectRepository.getManyByIds(dto.subjectIds);
    if (!subjects) throw createError.NotFound("invalid subjects");
    const teacher = await this.teacherRepository.create(dto);
    return plainToInstance(
      TeacherDto,
      { ...teacher, subjects },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async getMany(options?: { filters?: FilterTeacherDto }) {
    const teachers = await this.teacherRepository.getMany(options?.filters);
    return plainToInstance(TeacherDto, teachers, {
      exposeUnsetFields: false,
    });
  }

  async getById(id: number) {
    const teacher = await this.teacherRepository.getById(id);
    if (!teacher)
      throw createError.NotFound(`Teacher with id ${id} does not exist`);
    return teacher;
  }

  async update(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.getById(id);
    if (!teacher)
      throw createError.NotFound(`Teacher with id ${id} does not exist`);
    const subjectsExist = await this.subjectRepository.existsWithId(
      dto.subjectIds
    );
    if (!subjectsExist) throw createError.NotFound("invalid subjects");
    const { success: isUpdated } = await this.teacherRepository.updateById(
      id,
      dto
    );
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during deleteding assignment with id ${id}`
      );
    return this.teacherRepository.getById(id);
  }
}
