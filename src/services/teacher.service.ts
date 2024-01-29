import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { FindManyOptions, In } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";

import { plainToInstance } from "class-transformer";
import { CreateTeacherDto } from "../dto/teacher/create-teacher.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { TeacherDto } from "../dto/teacher/teacher.dto.js";
import { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import { Teacher } from "../entities/Teacher.entity.js";
import { subjectService } from "./subject.service.js";
import { User } from "../entities/User.entity.js";
import { UserDto } from "../dto/user/user.dto.js";

class TeacherService {
  private teacherRepository = AppDataSource.getRepository(Teacher);

  async create(userId: number, dto: CreateTeacherDto) {
    const teacher = this.teacherRepository.create({ userId });
    await this.teacherRepository.save(teacher);
    const subjects = await subjectService.getManyByIds(dto.subjectIds);
    if (!subjects) throw createError.NotFound("invalid subjects");
    await AppDataSource.createQueryBuilder()
      .insert()
      .into("teacher_subject")
      .values(subjects.map((s) => ({ teacherId: teacher.id, subjectId: s.id })))
      .execute();
    return plainToInstance(
      TeacherDto,
      { ...teacher, subjects },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async getMany(options?: { filters?: FilterTeacherDto }) {
    const findOptions: FindManyOptions<Teacher> = {
      relations: {
        subjects: true,
        user: true,
      },
      select: {
        id: true,
        user: {
          firstName: true,
          lastName: true,
        },
        subjects: true,
      },
      take: 10,
      skip: getPaginationOffset(options?.filters?.page || 1),
    };
    if (options?.filters?.subjectId) {
      findOptions.where = Array.isArray(options.filters.subjectId)
        ? { subjects: { id: In(options.filters.subjectId as number[]) } }
        : {
            subjects: { id: options.filters.subjectId as number },
          };
    }
    const teachers = await this.teacherRepository.find(findOptions);
    return plainToInstance(TeacherDto, teachers, {
      exposeUnsetFields: false,
    });
  }

  async getFullDataById(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: {
        subjects: true,
        user: true,
      },
      select: {
        id: true,
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
        subjects: true,
      },
    });
    if (!teacher)
      throw createError.NotFound(`Teacher with id ${id} does not exist`);
    return plainToInstance(TeacherDto, teacher, {
      exposeUnsetFields: false,
    });
  }

  async getTeacher(userId: number) {
    const teacher = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: { teacherProfile: { subjects: true } },
    });
    return plainToInstance(UserDto, teacher, { exposeUnsetFields: false });
  }

  async update(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher)
      throw createError.NotFound(`Teacher with id ${id} does not exist`);
    const subjects = await subjectService.getManyByIds(dto.subjectIds);
    if (!subjects) throw createError.NotFound("invalid subjects");
    await AppDataSource.createQueryBuilder()
      .delete()
      .from("teacher_subject")
      .where("teacherId  = :id", { id })
      .execute();
    await AppDataSource.createQueryBuilder()
      .insert()
      .into("teacher_subject")
      .values(dto.subjectIds.map((s) => ({ teacherId: id, subjectId: s })))
      .execute();
    return plainToInstance(
      TeacherDto,
      { ...teacher, subjects },
      { exposeUnsetFields: false }
    );
  }

  // deprecated?
  async delete(id: number) {}

  async hasSubject(teacherId: number, subjectId: number) {
    return AppDataSource.createQueryBuilder()
      .from("teacher_subject", "ts")
      .where("ts.teacherId = :teacherId", { teacherId })
      .andWhere("ts.subjectId = :subjectId", { subjectId })
      .getExists();
  }
}

export const teacherService = new TeacherService();
