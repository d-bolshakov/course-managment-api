import { IsString, IsEmail, MinLength } from "class-validator";

export class LoginUserDto {
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
}
