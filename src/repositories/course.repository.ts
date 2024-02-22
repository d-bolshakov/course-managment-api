import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Course } from "../db/entities/Course.entity.js";
import { CourseDto } from "../dto/course/course.dto.js";
import { CreateCourseDto } from "../dto/course/create-course.dto.js";
import {
  FilterCourseDto,
  FilterCourseStatus,
} from "../dto/course/filter-course.dto.js";
import { LessThan, MoreThan } from "typeorm";
import type { FindOptionsWhere } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { EnrollmentStatus } from "../db/entities/Enrollment.entity.js";
import { UpdateCourseDto } from "../dto/course/update-course.dto.js";
import type { ICourseRepository } from "../interfaces/repositories/course-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class CourseRepository implements ICourseRepository {
  private courseRepo = AppDataSource.getRepository(Course);

  async create(teacherId: number, dto: CreateCourseDto) {
    const course = await this.courseRepo.save({ ...dto, teacherId });
    return plainToInstance(CourseDto, course, { exposeUnsetFields: false });
  }
  async updateById(id: number, updateDto: UpdateCourseDto) {
    try {
      const { affected } = await this.courseRepo.update({ id }, updateDto);
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async deleteById(id: number) {
    try {
      const { affected } = await this.courseRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async getById(id: number) {
    const course = await this.courseRepo.findOne({
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
    return plainToInstance(CourseDto, course, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: FilterCourseDto) {
    const conditions: FindOptionsWhere<Course> = {};
    if (filters?.subjectId) conditions.subject = { id: filters.subjectId };
    if (filters?.teacherId) conditions.teacher = { id: filters.teacherId };
    if (filters?.studentId)
      conditions.enrollments = { studentId: filters.studentId };
    if (filters?.status) {
      if (filters.status === FilterCourseStatus.ACTIVE) {
        conditions.startsAt = LessThan(new Date());
        conditions.endsAt = MoreThan(new Date());
      }
      if (filters.status === FilterCourseStatus.PAST)
        conditions.endsAt = LessThan(new Date());
      if (filters.status === FilterCourseStatus.FUTURE)
        conditions.startsAt = MoreThan(new Date());
    }
    const [courses, count] = await this.courseRepo.findAndCount({
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
      skip: getPaginationOffset(filters?.page || 1),
    });
    return {
      courses: plainToInstance(CourseDto, courses, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  existsWithId(id: number) {
    return this.courseRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }

  isActive(id: number) {
    return this.courseRepo
      .createQueryBuilder("c")
      .where("c.id = :id", { id })
      .andWhere("c.startsAt < CURRENT_TIMESTAMP")
      .andWhere("c.endsAt > CURRENT_TIMESTAMP")
      .getExists();
  }

  isEnrollmentAvailable(id: number) {
    return this.courseRepo
      .createQueryBuilder("c")
      .where("c.startsAt > CURRENT_TIMESTAMP")
      .andWhere("c.id = :courseId", { courseId: id })
      .andWhere(
        `c.maxStudents > (SELECT COUNT(*) FROM enrollment WHERE enrollment."courseId" = :courseId AND enrollment.status = :enrollmentStatus)`,
        { courseId: id, enrollmentStatus: EnrollmentStatus.ENROLLED }
      )
      .getExists();
  }

  studentHasAccess(courseId: number, studentId: number): Promise<boolean> {
    return this.courseRepo.exist({
      where: {
        id: courseId,
        enrollments: {
          studentId,
          status: EnrollmentStatus.ENROLLED,
        },
      },
    });
  }

  teacherHasAccess(courseId: number, teacherId: number): Promise<boolean> {
    return this.courseRepo.exist({
      where: {
        id: courseId,
        teacherId,
      },
    });
  }
}
