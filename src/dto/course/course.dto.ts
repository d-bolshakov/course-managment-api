import { Expose, Type } from "class-transformer";
import { EnrollmentDto } from "../enrollment/enrollment.dto.js";
import { AssignmentDto } from "../assignment/assignment.dto.js";
import { SubjectDto } from "../subject/subject.dto.js";
import { TeacherDto } from "../teacher/teacher.dto.js";

export class CourseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly subjectId: number;

  @Expose()
  readonly teacherId: number;

  @Expose()
  readonly maxStudents: number;

  @Expose()
  @Type(() => Date)
  readonly startsAt: Date;

  @Expose()
  @Type(() => Date)
  readonly endsAt: Date;

  @Expose()
  @Type(() => EnrollmentDto)
  readonly enrollments: EnrollmentDto[];

  @Expose()
  @Type(() => AssignmentDto)
  readonly assignments: AssignmentDto[];

  @Expose()
  @Type(() => SubjectDto)
  readonly subject: () => SubjectDto;

  @Expose()
  @Type(() => TeacherDto)
  readonly teacher: () => TeacherDto;
}
