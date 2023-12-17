import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Teacher, Role, User } from "../entities/";
import { subjectService, userService } from "./";
import { TeacherDto } from "../dto/teacher.dto";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";

class TeacherService {
  private teacherRepository = AppDataSource.getRepository(Teacher);

  async create(dto: TeacherDto, user: User) {
    const candidate = await this.teacherRepository.findOne({
      where: { user },
    });
    if (candidate)
      throw BadRequest(
        `Teacher assosiated with user with id ${user.id} already exists`
      );
    const teacher = new Teacher();
    teacher.subjects = await subjectService.getMany({
      conditions: { id: In(dto.subjects as number[]) },
      disablePagination: true,
    });
    teacher.user = user;
    await this.teacherRepository.save(teacher);
    await userService.updateRole(user, Role.TEACHER);
    return teacher;
  }

  async getOne(
    conditions: FindOptionsWhere<Teacher>,
    relations?: FindOptionsRelations<Teacher>
  ) {
    return this.teacherRepository.findOne({
      where: conditions,
      relations,
    });
  }

  async getMany(options?: {
    conditions?: FindOptionsWhere<Teacher>;
    relations?: FindOptionsRelations<Teacher>;
    disablePagination?: boolean;
    page?: number;
  }) {
    const findOptions: FindManyOptions<Teacher> = {
      where: options?.conditions,
      relations: options?.relations,
    };
    if (!options?.disablePagination) {
      findOptions.take = 10;
      findOptions.skip = getPaginationOffset(options?.page || 1);
    }
    return this.teacherRepository.find(findOptions);
  }

  async getManyFiltered(options: {
    relations?: FindOptionsRelations<Teacher>;
    filters: any;
    page?: number;
  }) {
    const conditions: FindOptionsWhere<Teacher> = {};
    const { subject } = options.filters;
    if (subject.length) conditions.subjects = { id: In(subject) };
    else conditions.subjects = { id: subject };
    return this.getMany({
      conditions,
      relations: options.relations,
      page: options?.page,
    });
  }

  async getById(id: number, options?: any) {
    const teacher = await this.getOne({ id }, options?.relations);
    if (!teacher) throw BadRequest(`Teacher with id ${id} does not exist`);
    return teacher;
  }

  async getByUserId(id: number, options?: any) {
    const teacher = await this.getOne({ user: { id } }, options?.relations);
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
        conditions: { id: In(dto.subjects as number[]) },
        disablePagination: true,
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
