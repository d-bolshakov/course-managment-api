import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { Role } from "../../entities/User.entity.js";

export class FilterUserDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsEnum(Role, { message: "invalid role" })
  readonly role?: Role;

  @Expose()
  @IsOptional()
  @IsBoolean({ message: "emailConfirmed should be a boolean" })
  @Type(() => Boolean)
  readonly emailConfirmed?: boolean;
}
