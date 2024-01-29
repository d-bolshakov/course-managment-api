import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { FindManyOptions, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { plainToInstance } from "class-transformer";
import { EnrollmentDto } from "../dto/enrollment/enrollment.dto.js";
import { FilterEnrollmentDto } from "../dto/enrollment/filter-enrollment.dto.js";
import { Course } from "../entities/Course.entity.js";
import { Enrollment, EnrollmentStatus } from "../entities/Enrollment.entity.js";

class EnrollmentService {
  private enrollmentRepository = AppDataSource.getRepository(Enrollment);

  async create(courseId: number, studentId: number) {
    if (!(await this.isEnrollmentAvailable(courseId)))
      throw new createError.BadRequest(
        `Enrollment for the course with id ${courseId} is not available`
      );
    const enrollment = this.enrollmentRepository.create({
      courseId,
      studentId,
      status: EnrollmentStatus.APPLIED,
    });
    await this.enrollmentRepository.save(enrollment);
    return plainToInstance(EnrollmentDto, enrollment, {
      exposeUnsetFields: false,
    });
  }

  async getMany(options: { filters: FilterEnrollmentDto }) {
    const conditions: FindOptionsWhere<Enrollment> = {};
    const { status, courseId } = options?.filters;
    if (courseId) conditions.course = { id: courseId };
    if (status) conditions.status = status;
    const enrollments = await this.enrollmentRepository.find({
      where: conditions,
      relations: {
        course: true,
        student: {
          user: true,
        },
      },
      select: {
        id: true,
        status: true,
        changedAt: true,
        course: {
          id: true,
          title: true,
        },
        student: {
          id: true,
          user: {
            firstName: true,
            lastName: true,
          },
        },
      },
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(EnrollmentDto, enrollments, {
      exposeUnsetFields: false,
    });
  }

  async getById(id: number) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
    });
    if (!enrollment)
      throw new createError.NotFound(`Enrollment with id ${id} does not exist`);
    return plainToInstance(EnrollmentDto, enrollment, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: any) {
    const enrollment = await this.getById(id);
    if (!(await this.isEnrollmentAvailable(enrollment.courseId)))
      throw new createError.BadRequest(
        `Could not update enrollment's status: enrollment for the course with id ${enrollment.courseId} is not available`
      );
    await this.enrollmentRepository.update({ id }, { status: dto.status });
    return plainToInstance(EnrollmentDto, enrollment, {
      exposeUnsetFields: false,
    });
  }

  async delete(id: number) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
    });
    if (!enrollment)
      throw new createError.NotFound(`Enrollment with id ${id} does not exist`);
    await this.enrollmentRepository.remove(enrollment);
    return { message: `Enrollment with id ${id} was deleted successfully` };
  }

  async isEnrolled(studentId: number, courseId: number) {
    return this.enrollmentRepository
      .createQueryBuilder("e")
      .where("e.studentId = :studentId", { studentId })
      .andWhere("e.courseId = :courseId", { courseId })
      .getExists();
  }

  async isEnrollmentAvailable(courseId: number) {
    return AppDataSource.createQueryBuilder()
      .from(Course, "c")
      .where("c.startsAt > CURRENT_TIMESTAMP")
      .andWhere("c.id = :courseId", { courseId })
      .andWhere(
        `c.maxStudents > (SELECT COUNT(*) FROM enrollment WHERE enrollment."courseId" = :courseId AND enrollment.status = :enrollmentStatus)`,
        { courseId, enrollmentStatus: EnrollmentStatus.ENROLLED }
      )
      .getExists();
  }
}

export const enrollmentService = new EnrollmentService();
