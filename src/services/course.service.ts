import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Course, User } from "../entities/";
import { subjectService, teacherService } from "./";
import { CourseDto } from "../dto/course.dto";
import {
  Between,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";

class CourseService {
  private courseRepository = AppDataSource.getRepository(Course);

  async create(dto: CourseDto, user: User) {
    const teacher = await teacherService.getByUserId(user.id);
    const teacherSubjects = await subjectService.getManyByTeacherId(teacher.id);
    const subject = teacherSubjects.find((s) => s.id === dto.subject);
    if (!subject)
      throw BadRequest(
        `Teacher with id ${teacher.id} does not have subject ${dto.subject} on his subjects' list`
      );
    const course = this.courseRepository.create(dto as Partial<Course>);
    course.subject = subject;
    course.teacher = teacher;
    return this.courseRepository.save(course);
  }

  async getOne(
    conditions: FindOptionsWhere<Course>,
    relations?: FindOptionsRelations<Course>
  ) {
    return this.courseRepository.findOne({
      where: conditions,
      relations,
    });
  }

  async getMany(options?: {
    conditions?: FindOptionsWhere<Course>;
    relations?: FindOptionsRelations<Course>;
    disablePagination?: boolean;
    page?: number;
  }) {
    const findOptions: FindManyOptions<Course> = {
      where: options?.conditions,
      relations: options?.relations,
    };
    if (!options?.disablePagination) {
      findOptions.take = 10;
      findOptions.skip = getPaginationOffset(options?.page || 1);
    }
    return this.courseRepository.find(findOptions);
  }

  async getManyFiltered(options?: {
    relations?: FindOptionsRelations<Course>;
    page?: number;
    filters: any;
  }) {
    const conditions: FindOptionsWhere<Course> = {};
    const { subject, teacher, minStudents, startsAfter, startsBefore } =
      options?.filters;
    if (subject) conditions.subject = { id: subject };
    if (teacher) conditions.teacher = { id: teacher };
    if (minStudents) conditions.maxStudents = MoreThanOrEqual(minStudents);
    if (startsAfter || startsBefore) {
      if (startsAfter && startsBefore)
        conditions.startsAt = Between(startsAfter, startsBefore);
      else if (startsAfter) conditions.startsAt = MoreThanOrEqual(startsAfter);
      else conditions.startsAt = LessThanOrEqual(startsBefore);
    }
    return this.getMany({
      conditions,
      relations: options?.relations,
      page: options?.page,
    });
  }

  async getById(id: number) {
    const course = await this.getOne(
      { id },
      {
        teacher: true,
        subject: true,
      }
    );
    if (!course) throw new BadRequest(`Course with id ${id} does not exist`);
    return course;
  }

  async update(id: number, dto: any) {
    const course = await this.getById(id);
    if (course.endsAt < new Date())
      throw new BadRequest(`Course with id ${id} has already ended`);
    await this.courseRepository.update(course, dto);
    return course;
  }

  async delete(id: number) {
    const course = await this.getById(id);
    await this.courseRepository.remove(course);
    return { message: `Course with id ${id} was deleted successfully` };
  }
}

export const courseService = new CourseService();
