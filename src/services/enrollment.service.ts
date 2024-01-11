import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Enrollment, Status, User } from "../entities";
import { courseService, studentService } from ".";
import {
  Between,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";
import { EnrollmentFilterDto } from "../dto/filters";

class EnrollmentService {
  private enrollmentRepository = AppDataSource.getRepository(Enrollment);

  async create(courseId: number, user: User) {
    const studentProfile = await studentService.getByUserId(user.id);
    if (user.role !== "student" || !studentProfile)
      throw new BadRequest(`Only students can enroll to the course`);
    const course = await courseService.getById(courseId);
    if (course.startsAt < new Date())
      throw new BadRequest(
        `Enrollment for the course with id ${course.id} is not available`
      );
    const enrollments = await this.getMany({
      filters: {
        courseId,
        status: Status.ENROLLED,
      },
    });
    if (enrollments.length == course.maxStudents)
      throw new BadRequest(
        `Enrollment for the course with id ${course.id} is not available`
      );
    const enrollment = new Enrollment();
    enrollment.student = studentProfile;
    enrollment.course = course;
    enrollment.status = Status.APPLIED;
    return this.enrollmentRepository.save(enrollment);
  }

  async getOne(
    conditions: FindOptionsWhere<Enrollment>,
    options?: {
      relations?: FindOptionsRelations<Enrollment>;
      select?: FindOptionsSelect<Enrollment>;
    }
  ) {
    return this.enrollmentRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options: {
    filters: EnrollmentFilterDto;
    relations?: FindOptionsRelations<Enrollment>;
    select?: FindOptionsSelect<Enrollment>;
    page?: number;
  }) {
    const conditions: FindOptionsWhere<Enrollment> = {};
    const { status, courseId } = options?.filters;
    if (courseId) conditions.course = { id: courseId };
    if (status) conditions.status = status;
    const findOptions: FindManyOptions<Enrollment> = {
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    };
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);
    return this.enrollmentRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Enrollment>;
      select?: FindOptionsSelect<Enrollment>;
    }
  ) {
    const enrollment = await this.getOne({ id }, options);
    if (!enrollment)
      throw new BadRequest(`Enrollment with id ${id} does not exist`);
    return enrollment;
  }

  async update(id: number, dto: any) {
    const enrollment = await this.getById(id, { relations: { course: true } });
    if (enrollment.course.startsAt < new Date())
      throw new BadRequest(`Could not update enrollment's status`);
    enrollment.status = dto.status;
    return this.enrollmentRepository.save(enrollment);
  }

  async delete(id: number) {
    const enrollment = await this.getById(id);
    await this.enrollmentRepository.remove(enrollment);
    return { message: `Enrollment with id ${id} was deleted successfully` };
  }
}

export const enrollmentService = new EnrollmentService();
