import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Course, User } from "../entities/";
import { teacherService } from "./";
import {
  Between,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";
import { CreateCourseDto, FilterCourseDto, UpdateCourseDto } from "../dto/";

class CourseService {
  private courseRepository = AppDataSource.getRepository(Course);

  async create(dto: CreateCourseDto, user: User) {
    const teacher = await teacherService.getByUserId(user.id, {
      relations: { subjects: true },
    });
    const subject = teacher.subjects.find((s) => s.id === dto.subjectId);
    if (!subject)
      throw BadRequest(
        `Teacher with id ${teacher.id} does not have subject ${dto.subjectId} on his subjects' list`
      );
    const course = new Course();
    course.title = dto.title;
    course.maxStudents = dto.maxStudents;
    course.startsAt = dto.startsAt;
    course.endsAt = dto.endsAt;
    course.subject = subject;
    course.teacher = teacher;
    return this.courseRepository.save(course);
  }

  async getOne(
    conditions: FindOptionsWhere<Course>,
    options?: {
      relations?: FindOptionsRelations<Course>;
      select?: FindOptionsSelect<Course>;
    }
  ) {
    return this.courseRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options: {
    filters: FilterCourseDto;
    relations?: FindOptionsRelations<Course>;
    select?: FindOptionsSelect<Course>;
    page?: number;
  }) {
    const conditions: FindOptionsWhere<Course> = {};
    const { subjectId, teacherId, startsAfter, startsBefore } = options.filters;
    if (subjectId) conditions.subject = { id: subjectId };
    if (teacherId) conditions.teacher = { id: teacherId };
    if (startsAfter || startsBefore) {
      if (startsAfter && startsBefore)
        conditions.startsAt = Between(startsAfter, startsBefore);
      else if (startsAfter) conditions.startsAt = MoreThanOrEqual(startsAfter);
      else conditions.startsAt = LessThanOrEqual(startsBefore);
    }
    const findOptions: FindManyOptions<Course> = {
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    };
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);
    return this.courseRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Course>;
      select?: FindOptionsSelect<Course>;
    }
  ) {
    const course = await this.getOne({ id }, options);
    if (!course) throw new BadRequest(`Course with id ${id} does not exist`);
    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.getById(id);
    if (course.endsAt < new Date())
      throw new BadRequest(`Course with id ${id} has already ended`);
    course.startsAt = dto.startsAt;
    course.endsAt = dto.endsAt;
    course.maxStudents = dto.maxStudents;
    await this.courseRepository.save(course);
    return course;
  }

  async delete(id: number) {
    const course = await this.getById(id);
    await this.courseRepository.remove(course);
    return { message: `Course with id ${id} was deleted successfully` };
  }
}

export const courseService = new CourseService();
