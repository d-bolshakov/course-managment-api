import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  NotEquals,
  ValidateIf,
  IsNotEmpty,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { Role } from "../../entities/User.entity.js";
import { Expose, Transform, Type } from "class-transformer";
import { CreateTeacherDto } from "../teacher/create-teacher.dto.js";

export class RegisterUserDto {
  @Expose()
  @IsString({
    message: "firstName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly firstName: string;

  @Expose()
  @IsString({
    message: "lastName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly lastName: string;

  @Expose()
  @IsString({
    message: "email should be a string",
  })
  @IsEmail(
    {},
    {
      message: "email is not valid",
    }
  )
  readonly email: string;

  @Expose()
  @IsString({
    message: "password should be a string",
  })
  @MinLength(6, {
    message: "passwword should be minimum of 6 characters",
  })
  readonly password: string;

  @Expose()
  @IsEnum(Role, { message: "invalid role" })
  @NotEquals(Role.ADMIN, { message: "invalid role" })
  readonly role: Role;

  @Expose()
  @ValidateIf((obj: any, value: any) => obj.role === Role.TEACHER)
  @IsDefined({ message: "teacherProfile should be defined" })
  @ValidateNested()
  @Type(() => CreateTeacherDto)
  teacherProfile: CreateTeacherDto;
}
