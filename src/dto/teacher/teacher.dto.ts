import { Exclude, Expose, Transform, Type } from "class-transformer";
import { SubjectDto } from "../subject/subject.dto.js";
import { UserDto } from "../user/user.dto.js";
import { CourseDto } from "../course/course.dto.js";

export class TeacherDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => SubjectDto)
  readonly subjects: SubjectDto[];

  @Exclude()
  @Type(() => UserDto)
  readonly user: () => UserDto;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.email)
  readonly email?: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.firstName)
  readonly firstName?: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.lastName)
  readonly lastName?: string;

  @Expose()
  @Type(() => CourseDto)
  readonly courses: CourseDto[];
}
