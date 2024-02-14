import createError from "http-errors";
import { FilterEnrollmentDto } from "../dto/enrollment/filter-enrollment.dto.js";
import type { IEnrollmentService } from "../interfaces/services/enrollment-service.interface.js";
import { UpdateEnrollmentDto } from "../dto/enrollment/update-enrollment.dto.js";
import { inject, injectable } from "tsyringe";
import type { IEnrollmentRepository } from "../interfaces/repositories/enrollment-repository.interface.js";
import type { ICourseRepository } from "../interfaces/repositories/course-repository.interface.js";

@injectable()
export class EnrollmentService implements IEnrollmentService {
  constructor(
    @inject("enrollment-repository")
    private enrollmentRepository: IEnrollmentRepository,
    @inject("course-repository") private courseRepository: ICourseRepository
  ) {}

  async create(courseId: number, studentId: number) {
    if (!(await this.courseRepository.isEnrollmentAvailable(courseId)))
      throw createError.BadRequest(
        `Enrollment for the course with id ${courseId} is not available`
      );
    const enrollment = await this.enrollmentRepository.create({
      courseId,
      studentId,
    });
    return enrollment;
  }

  async getMany(options?: { filters: FilterEnrollmentDto }) {
    return this.enrollmentRepository.getMany(options?.filters);
  }

  async getById(id: number) {
    const enrollment = await this.enrollmentRepository.getById(id);
    if (!enrollment)
      throw createError.NotFound(`Enrollment with id ${id} does not exist`);
    return enrollment;
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    const enrollment = await this.getById(id);
    if (
      !(await this.courseRepository.isEnrollmentAvailable(enrollment.courseId))
    )
      throw createError.BadRequest(
        `Could not update enrollment's status: enrollment for the course with id ${enrollment.courseId} is not available`
      );
    const { success: isUpdated } = await this.enrollmentRepository.updateById(
      id,
      dto
    );
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during updating enrollment with id ${id}`
      );
    return this.enrollmentRepository.getById(id);
  }

  async delete(id: number) {
    if (!(await this.enrollmentRepository.existsWithId(id)))
      throw createError.NotFound(`Enrollment with id ${id} does not exist`);
    const result = await this.enrollmentRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleteding enrollment with id ${id}`
      );
    return result;
  }
}
