import { IsString, IsEmail, MinLength } from "class-validator";
import { Expose } from "class-transformer";

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
}
