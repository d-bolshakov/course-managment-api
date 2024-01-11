import { IsString, IsEmail, MinLength } from "class-validator";
import { Role } from "../entities/";
import { Expose } from "class-transformer";
import { BaseDtoGroups } from "./";

export enum AuthDtoGroups {
  REGISTRATION = "registration",
  LOGIN = "login",
}

export class UserDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({
    groups: [
      AuthDtoGroups.REGISTRATION,
      BaseDtoGroups.RESPONSE_FULL,
      BaseDtoGroups.RESPONSE_PARTIAL,
    ],
  })
  @IsString({
    message: "firstName should be a string",
    groups: [AuthDtoGroups.REGISTRATION],
  })
  @MinLength(2, {
    message: "firstName should be longer than 2 characters",
    groups: [AuthDtoGroups.REGISTRATION],
  })
  public firstName: string;

  @Expose({
    groups: [
      AuthDtoGroups.REGISTRATION,
      BaseDtoGroups.RESPONSE_FULL,
      BaseDtoGroups.RESPONSE_PARTIAL,
    ],
  })
  @IsString({
    message: "lastName should be a string",
    groups: [AuthDtoGroups.REGISTRATION],
  })
  @MinLength(2, {
    message: "lirstName should be longer than 2 characters",
    groups: [AuthDtoGroups.REGISTRATION],
  })
  public lastName: string;

  @Expose({
    groups: [
      AuthDtoGroups.REGISTRATION,
      AuthDtoGroups.LOGIN,
      BaseDtoGroups.RESPONSE_FULL,
      BaseDtoGroups.RESPONSE_PARTIAL,
    ],
  })
  @IsEmail(
    {},
    {
      message: "email is not valid",
      groups: [AuthDtoGroups.REGISTRATION, AuthDtoGroups.LOGIN],
    }
  )
  email: string;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  isEmailConfirmed: boolean;

  @Expose({
    groups: [AuthDtoGroups.REGISTRATION, AuthDtoGroups.LOGIN],
  })
  @IsString({
    message: "password should be a string",
    groups: [AuthDtoGroups.REGISTRATION, AuthDtoGroups.LOGIN],
  })
  @MinLength(6, {
    message: "passwword should be minimum of 6 characters",
    groups: [AuthDtoGroups.REGISTRATION, AuthDtoGroups.LOGIN],
  })
  password: string;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  role: Role;
}
