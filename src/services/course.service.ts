import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  QueryBuilder,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { plainToInstance } from "class-transformer";
import { CourseDto } from "../dto/course/course.dto.js";
import { CreateCourseDto } from "../dto/course/create-course.dto.js";
import { FilterCourseDto } from "../dto/course/filter-course.dto.js";
import { FilterStudentCourseDto } from "../dto/course/filter-student-course.dto.js";
import {
  FilterTeacherCourseDto,
  FilterTeacherCourseStatus,
} from "../dto/course/filter-teacher-course.dto.js";
import { UpdateCourseDto } from "../dto/course/update-course.dto.js";
import { Course } from "../entities/Course.entity.js";
import { teacherService } from "./teacher.service.js";

class CourseService {
  private courseRepository = AppDataSource.getRepository(Course);

  async create(dto: CreateCourseDto, teacherId: number) {
    if (!(await teacherService.hasSubject(teacherId, dto.subjectId)))
      throw createError.BadRequest(
        `Teacher with id ${teacherId} does not have subject ${dto.subjectId} on his subjects' list`
      );
    const course = this.courseRepository.create({
      ...dto,
      teacherId,
    });
    await this.courseRepository.save(course);
    return plainToInstance(CourseDto, course, {
      exposeUnsetFields: false,
    });
  }

  async getMany(options: { filters: FilterCourseDto }) {
    const conditions: FindOptionsWhere<Course> = {};
    const { subjectId, teacherId } = options.filters;
    if (subjectId) conditions.subject = { id: subjectId };
    if (teacherId) conditions.teacher = { id: teacherId };
    conditions.startsAt = MoreThanOrEqual(new Date());
    const courses = await this.courseRepository.find({
      where: conditions,
      relations: {
        subject: true,
        teacher: {
          user: true,
        },
      },
      select: {
        id: true,
        title: true,
        teacher: {
          id: true,
          user: {
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          id: true,
          title: true,
        },
      },
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(CourseDto, courses, {
      exposeUnsetFields: false,
    });
  }

  async getCoursesOfTeacher(
    teacherId: number,
    options?: { filters: FilterTeacherCourseDto }
  ) {
    const conditions: FindOptionsWhere<Course> = { teacherId };
    if (options?.filters.subjectId)
      conditions.subjectId = options.filters.subjectId;
    if (options?.filters.status) {
      if (options.filters.status === FilterTeacherCourseStatus.ACTIVE) {
        conditions.startsAt = LessThan(new Date());
        conditions.endsAt = MoreThan(new Date());
      }
      if (options.filters.status === FilterTeacherCourseStatus.PAST)
        conditions.endsAt = LessThan(new Date());
      if (options.filters.status === FilterTeacherCourseStatus.FUTURE)
        conditions.startsAt = MoreThan(new Date());
    }
    const findOptions: FindManyOptions<Course> = {
      relations: {
        subject: true,
        teacher: {
          user: true,
        },
      },
      select: {
        id: true,
        title: true,
        teacher: {
          id: true,
          user: {
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          id: true,
          title: true,
        },
      },
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    };
    const courses = await this.courseRepository.find(findOptions);
    return plainToInstance(CourseDto, courses, {
      exposeUnsetFields: false,
    });
  }

  async getCoursesOfStudent(
    studentId: number,
    options?: { filters: FilterStudentCourseDto }
  ) {
    const conditions: FindOptionsWhere<Course> = { enrollments: { studentId } };
    if (options?.filters.teacherId)
      conditions.teacherId = options.filters.teacherId;
    if (options?.filters.subjectId)
      conditions.subjectId = options.filters.subjectId;
    if (options?.filters.status) {
      if (options.filters.status === FilterTeacherCourseStatus.ACTIVE) {
        conditions.startsAt = LessThan(new Date());
        conditions.endsAt = MoreThan(new Date());
      } else if (options.filters.status === FilterTeacherCourseStatus.PAST)
        conditions.endsAt = LessThan(new Date());
      else if (options.filters.status === FilterTeacherCourseStatus.FUTURE)
        conditions.startsAt = MoreThan(new Date());
    }
    const findOptions: FindManyOptions<Course> = {
      relations: {
        subject: true,
        teacher: {
          user: true,
        },
      },
      select: {
        id: true,
        title: true,
        teacher: {
          id: true,
          user: {
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          id: true,
          title: true,
        },
      },
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    };
    const courses = await this.courseRepository.find(findOptions);
    return plainToInstance(CourseDto, courses, {
      exposeUnsetFields: false,
    });
  }

  async getFullDataById(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: {
        subject: true,
        teacher: {
          user: true,
        },
      },
      select: {
        id: true,
        title: true,
        subject: {
          id: true,
          title: true,
        },
        startsAt: true,
        endsAt: true,
        teacher: {
          id: true,
          user: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!course)
      throw new createError.NotFound(`Course with id ${id} does not exist`);
    return plainToInstance(CourseDto, course, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });
    if (!course)
      throw new createError.NotFound(`Course with id ${id} does not exist`);
    if (course.endsAt < new Date())
      throw new createError.BadRequest(
        `Course with id ${id} has already ended`
      );
    course.startsAt = dto.startsAt;
    course.endsAt = dto.endsAt;
    course.maxStudents = dto.maxStudents;
    await this.courseRepository.update({ id }, dto);
    return plainToInstance(CourseDto, course, {
      exposeUnsetFields: false,
    });
  }

  async delete(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });
    if (!course)
      throw new createError.NotFound(`Course with id ${id} does not exist`);
    await this.courseRepository.remove(course);
    return { message: `Course with id ${id} was deleted successfully` };
  }

  async isActive(id: number) {
    return this.courseRepository
      .createQueryBuilder("c")
      .where("c.id = :id", { id })
      .andWhere("c.startsAt < CURRENT_TIMESTAMP")
      .andWhere("c.endsAt > CURRENT_TIMESTAMP")
      .getExists();
  }
}

export const courseService = new CourseService();
