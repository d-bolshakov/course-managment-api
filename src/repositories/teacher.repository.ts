import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Teacher } from "../entities/Teacher.entity.js";
import { TeacherDto } from "../dto/teacher/teacher.dto.js";
import { FilterTeacherDto } from "../dto/teacher/filter-teacher.dto.js";
import { In } from "typeorm";
import type { FindManyOptions } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import type { ITeacherRepository } from "../interfaces/repositories/teacher-repository.interface.js";
import type { CreateTeacherDto } from "../dto/teacher/create-teacher.dto.js";
import type { UpdateTeacherDto } from "../dto/teacher/update-teacher.dto.js";
import { inject, injectable } from "tsyringe";
import type { ITeacherSubjectRepository } from "../interfaces/repositories/teacher-subject-repository.interface.js";

@injectable()
export class TeacherRepository implements ITeacherRepository {
  constructor(
    @inject("teacher-subject-repository")
    private teacherSubjectRepo: ITeacherSubjectRepository
  ) {}
  private teacherRepo = AppDataSource.getRepository(Teacher);

  async create(dto: CreateTeacherDto) {
    const teacher = await this.teacherRepo.save({ userId: dto.userId });
    const teacherSubject = await this.teacherSubjectRepo.create(
      dto.subjectIds.map((s) => ({ teacherId: teacher.id, subjectId: s }))
    );
    return plainToInstance(TeacherDto, teacher, { exposeUnsetFields: false });
  }
  async updateById(id: number, dto: UpdateTeacherDto) {
    try {
      const deletedSubjects =
        await this.teacherSubjectRepo.deleteManyByTeacherId(id);
      if (!deletedSubjects) return { success: false };
      const createdSubjects = await this.teacherSubjectRepo.create(
        dto.subjectIds.map((s) => ({ subjectId: s, teacherId: id }))
      );
      if (!createdSubjects) return { success: false };
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }
  async deleteById(id: number) {
    try {
      const { affected } = await this.teacherRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }

  async getById(id: number) {
    const teacher = await this.teacherRepo.findOne({
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
    return plainToInstance(TeacherDto, teacher, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: FilterTeacherDto) {
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
      skip: getPaginationOffset(filters?.page || 1),
    };
    if (filters?.subjectId) {
      findOptions.where = Array.isArray(filters.subjectId)
        ? { subjects: { id: In(filters.subjectId as number[]) } }
        : {
            subjects: { id: filters.subjectId as number },
          };
    }
    const teachers = await this.teacherRepo.find(findOptions);
    return plainToInstance(TeacherDto, teachers, {
      exposeUnsetFields: false,
    });
  }
}
