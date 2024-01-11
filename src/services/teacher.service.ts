import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Teacher, Role, User } from "../entities/";
import { subjectService, userService } from "./";
import { TeacherDto } from "../dto/teacher.dto";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";
import { TeacherFilterDto } from "../dto/filters";

class TeacherService {
  private teacherRepository = AppDataSource.getRepository(Teacher);

  async create(dto: TeacherDto, user: User) {
    const candidate = await this.teacherRepository.findOne({
      where: { id: user.id },
    });
    if (candidate)
      throw BadRequest(
        `Teacher assosiated with user with id ${user.id} already exists`
      );
    const teacher = new Teacher();
    teacher.subjects = await subjectService.getMany({
      conditions: { id: In(dto.subjectId) },
    });
    teacher.user = user;
    await this.teacherRepository.save(teacher);
    await userService.updateRole(user, Role.TEACHER);
    return teacher;
  }

  async getOne(
    conditions: FindOptionsWhere<Teacher>,
    options?: {
      relations?: FindOptionsRelations<Teacher>;
      select?: FindOptionsSelect<Teacher>;
    }
  ) {
    return this.teacherRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options?: {
    filters?: TeacherFilterDto;
    relations?: FindOptionsRelations<Teacher>;
    select?: FindOptionsSelect<Teacher>;
    page?: number;
  }) {
    const findOptions: FindManyOptions<Teacher> = {
      relations: options?.relations,
      select: options?.select,
    };
    if (options?.filters?.subjectId) {
      findOptions.where = Array.isArray(options.filters.subjectId)
        ? { subjects: { id: In(options.filters.subjectId as number[]) } }
        : {
            subjects: { id: options.filters.subjectId as number },
          };
    }
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);
    return this.teacherRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Teacher>;
      select?: FindOptionsSelect<Teacher>;
    }
  ) {
    const teacher = await this.getOne({ id }, options);
    if (!teacher) throw BadRequest(`Teacher with id ${id} does not exist`);
    return teacher;
  }

  async getByUserId(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Teacher>;
      select?: FindOptionsSelect<Teacher>;
    }
  ) {
    const teacher = await this.getOne({ user: { id } }, options);
    if (!teacher)
      throw BadRequest(
        `Teacher associated with user with id ${id} does not exist`
      );
    return teacher;
  }

  async getCoursesByTeacher(id: number) {
    const teacher = await this.getById(id, { relations: { courses: true } });
    return teacher.courses;
  }

  async update(id: number, dto: TeacherDto) {
    const teacher = await this.getById(id, { relations: { user: true } });
    if (dto.subjects) {
      teacher.subjects = await subjectService.getMany({
        conditions: { id: In(dto.subjectId) },
      });
    }
    return this.teacherRepository.save(teacher);
  }

  async delete(id: number) {
    const teacher = await this.getById(id);
    await userService.updateRole(teacher.user, Role.STUDENT);
    await this.teacherRepository.remove(teacher);
    return { message: `Teacher with id ${id} was deleted successfully` };
  }
}

export const teacherService = new TeacherService();
