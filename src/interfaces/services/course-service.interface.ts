import { CourseDto } from "../../dto/course/course.dto";
import { CreateCourseDto } from "../../dto/course/create-course.dto";
import type { FilterBaseCourseDto } from "../../dto/course/filter-base-course.dto";
import { FilterTeacherCourseDto } from "../../dto/course/filter-teacher-course.dto";
import { UpdateCourseDto } from "../../dto/course/update-course.dto";

export interface ICourseService {
  create(teacherId: number, dto: CreateCourseDto): Promise<CourseDto>;

  getMany(options: { filters: FilterBaseCourseDto }): Promise<CourseDto[]>;

  getCoursesOfTeacher(
    teacherId: number,
    options: { filters: FilterTeacherCourseDto }
  ): Promise<CourseDto[]>;

  getCoursesOfStudent(
    studentId: number,
    options: { filters: FilterBaseCourseDto }
  ): Promise<CourseDto[]>;

  getById(id: number): Promise<CourseDto>;

  update(id: number, dto: UpdateCourseDto): Promise<CourseDto | null>;

  delete(id: number): Promise<{ success: boolean }>;
}
