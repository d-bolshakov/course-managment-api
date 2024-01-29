import { Expose, Type } from "class-transformer";
import { CourseDto } from "../course/course.dto.js";
import { TeacherDto } from "../teacher/teacher.dto.js";

export class SubjectDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  @Type(() => CourseDto)
  readonly courses: CourseDto[];

  @Expose()
  @Type(() => TeacherDto)
  readonly teachers: TeacherDto[];
}
