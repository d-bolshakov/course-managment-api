import { Expose, Type } from "class-transformer";
import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { UpdateTeacherDto } from "../teacher/update-teacher.dto";

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "firstName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly firstName: string;

  @Expose()
  @IsOptional()
  @IsString({
    message: "lastName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly lastName: string;

  @Expose()
  @IsOptional()
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
}
