import { Exclude, Expose, Type } from "class-transformer";
import { Role } from "../../entities/User.entity.js";
import { StudentDto } from "../student/student.dto.js";
import { TeacherDto } from "../teacher/teacher.dto.js";

export class UserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly isEmailConfirmed: boolean;

  @Exclude()
  readonly password: string;

  @Expose()
  readonly role: Role;

  @Expose()
  @Type(() => StudentDto)
  readonly studentProfile: () => StudentDto;

  @Expose()
  @Type(() => TeacherDto)
  readonly teacherProfile: () => TeacherDto;
}
