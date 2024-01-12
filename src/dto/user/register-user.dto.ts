import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  NotEquals,
} from "class-validator";
import { Role } from "../../entities";

export class RegisterUserDto {
  @IsString({
    message: "firstName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly firstName: string;

  @IsString({
    message: "lastName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly lastName: string;

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

  @IsString({
    message: "password should be a string",
  })
  @MinLength(6, {
    message: "passwword should be minimum of 6 characters",
  })
  readonly password: string;

  @IsEnum(Role, { message: "invalid role" })
  @NotEquals(Role.ADMIN, { message: "invalid role" })
  readonly role: Role;
}
