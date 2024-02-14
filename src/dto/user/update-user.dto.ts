import { Expose } from "class-transformer";
import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";
import type { Role } from "../../entities/User.entity";

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsString({
    message: "firstName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly firstName?: string;

  @Expose()
  @IsOptional()
  @IsString({
    message: "lastName should be a string",
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
  })
  readonly lastName?: string;

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
  readonly email?: string;

  @Expose()
  @IsOptional()
  readonly role?: Role | null;
}
