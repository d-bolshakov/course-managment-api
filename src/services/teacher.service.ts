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
import type { IUserService } from "../interfaces/services/user-service.interface.js";
import { Role } from "../entities/User.entity.js";

@injectable()
export class TeacherService implements ITeacherService {
  constructor(
    @inject("teacher-repository") private teacherRepository: ITeacherRepository,
    @inject("subject-repository") private subjectRepository: ISubjectRepository,
    @inject("user-service") private userService: IUserService
  ) {}

  async create(dto: CreateTeacherDto) {
    const subjects = await this.subjectRepository.getManyByIds(dto.subjectIds);
    if (!subjects) throw createError.NotFound("invalid subjects");
    const teacher = await this.teacherRepository.create(dto);
    const { success: isUserRoleUpdated } = await this.userService.updateRole(
      dto.userId,
      Role.TEACHER
    );
    if (!isUserRoleUpdated)
      throw createError.InternalServerError(
        "Somethhing went wrong during creating teacher"
      );

    return this.teacherRepository.getById(teacher.id);
  }

  async getMany(options?: { filters?: FilterTeacherDto }) {
    return this.teacherRepository.getMany(options?.filters);
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
        `Something went wrong during updating teacher with id ${id}`
      );
    return this.teacherRepository.getById(id);
  }

  async delete(id: number) {
    const teacher = await this.teacherRepository.getById(id);
    if (!teacher)
      throw createError.NotFound(`Teacher with id ${id} does not exist`);
    const result = await this.teacherRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleting teacher with id ${id}`
      );
    await this.userService.updateRole(teacher.userId, null);
    return result;
  }
}
