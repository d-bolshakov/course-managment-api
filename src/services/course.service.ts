import createError from "http-errors";
import { CourseDto } from "../dto/course/course.dto.js";
import { CreateCourseDto } from "../dto/course/create-course.dto.js";
import { FilterCourseDto } from "../dto/course/filter-course.dto.js";
import { UpdateCourseDto } from "../dto/course/update-course.dto.js";
import type { ICourseService } from "../interfaces/services/course-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { ICourseRepository } from "../interfaces/repositories/course-repository.interface.js";
import type { ITeacherSubjectRepository } from "../interfaces/repositories/teacher-subject-repository.interface.js";

@injectable()
export class CourseService implements ICourseService {
  constructor(
    @inject("course-repository") private courseRepository: ICourseRepository,
    @inject("teacher-subject-repository")
    private teacherSubjectRepository: ITeacherSubjectRepository
  ) {}

  async create(teacherId: number, dto: CreateCourseDto) {
    if (
      !(await this.teacherSubjectRepository.teacherHasSubject(
        teacherId,
        dto.subjectId
      ))
    )
      throw createError.BadRequest(
        `Teacher with id ${teacherId} does not have subject ${dto.subjectId} on his subjects' list`
      );
    const course = this.courseRepository.create(teacherId, dto);
    return course;
  }

  async getMany(options: { filters: FilterCourseDto }) {
    return this.courseRepository.getMany(options.filters);
  }

  async getCoursesOfTeacher(
    teacherId: number,
    options?: { filters: FilterCourseDto }
  ) {
    return this.courseRepository.getMany({ ...options!.filters, teacherId });
  }

  async getCoursesOfStudent(
    studentId: number,
    options?: { filters: FilterCourseDto }
  ) {
    return this.courseRepository.getMany({ ...options!.filters, studentId });
  }

  async getFullDataById(id: number): Promise<CourseDto> {
    const course = await this.courseRepository.getFullDataById(id);
    if (!course)
      throw createError.NotFound(`Course with id ${id} does not exist`);
    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.courseRepository.getById(id);
    if (!course)
      throw createError.NotFound(`Course with id ${id} does not exist`);
    if (course.endsAt < new Date())
      throw createError.BadRequest(`Course with id ${id} has already ended`);
    const { success: isUpdated } = await this.courseRepository.updateById(
      id,
      dto
    );
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during deleteding assignment with id ${id}`
      );
    return this.courseRepository.getById(id);
  }

  async delete(id: number) {
    if (!(await this.courseRepository.existsWithId(id)))
      throw createError.NotFound(`Course with id ${id} does not exist`);
    const { success: isDeleted } = await this.courseRepository.deleteById(id);
    if (!isDeleted)
      throw createError.InternalServerError(
        `Something went wrong during deleteding course with id ${id}`
      );
    return { message: `Course with id ${id} was deleted successfully` };
  }
}
