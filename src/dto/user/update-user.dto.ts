import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: "firstName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly firstName: string;

  @IsOptional()
  @IsString({
    message: "lastName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly lastName: string;

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
