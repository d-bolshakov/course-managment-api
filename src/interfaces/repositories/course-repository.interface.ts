import type { CourseDto } from "../../dto/course/course.dto";
import type { CreateCourseDto } from "../../dto/course/create-course.dto";
import type { FilterCourseDto } from "../../dto/course/filter-course.dto";
import type { UpdateCourseDto } from "../../dto/course/update-course.dto";

export interface ICourseRepository {
  create(teacherId: number, dto: CreateCourseDto): Promise<CourseDto>;
  updateById(
    id: number,
    updateDto: UpdateCourseDto
  ): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<CourseDto | null>;
  getMany(
    filters?: FilterCourseDto
  ): Promise<{ courses: CourseDto[]; count: number }>;
  existsWithId(id: number): Promise<boolean>;
  isActive(id: number): Promise<boolean>;
  isEnrollmentAvailable(id: number): Promise<boolean>;
}
