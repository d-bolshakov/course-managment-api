import { Expose, Type } from "class-transformer";
import { EnrollmentStatus } from "../../entities/Enrollment.entity.js";
import { CourseDto } from "../course/course.dto.js";
import { StudentDto } from "../student/student.dto.js";

export class EnrollmentDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly status: EnrollmentStatus;

  @Expose()
  @Type(() => Date)
  readonly changedAt: Date;

  @Expose()
  readonly courseId: number;

  @Expose()
  readonly studentId: number;

  @Expose()
  @Type(() => StudentDto)
  readonly student: () => StudentDto;

  @Expose()
  @Type(() => CourseDto)
  readonly course: () => CourseDto;
}
