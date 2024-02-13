import { CourseDto } from "../../dto/course/course.dto";
import { CreateCourseDto } from "../../dto/course/create-course.dto";
import { FilterCourseDto } from "../../dto/course/filter-course.dto";
import { FilterStudentCourseDto } from "../../dto/course/filter-student-course.dto";
import { FilterTeacherCourseDto } from "../../dto/course/filter-teacher-course.dto";
import { UpdateCourseDto } from "../../dto/course/update-course.dto";

export interface ICourseService {
  create(teacherId: number, dto: CreateCourseDto): Promise<CourseDto>;

  getMany(options: { filters: FilterCourseDto }): Promise<CourseDto[]>;

  getCoursesOfTeacher(
    teacherId: number,
    options: { filters: FilterCourseDto }
  ): Promise<CourseDto[]>;

  getCoursesOfStudent(
    studentId: number,
    options: { filters: FilterCourseDto }
  ): Promise<CourseDto[]>;

  getFullDataById(id: number): Promise<CourseDto>;

  update(id: number, dto: UpdateCourseDto): Promise<CourseDto | null>;

  delete(id: number): Promise<{ message: string }>;
}
