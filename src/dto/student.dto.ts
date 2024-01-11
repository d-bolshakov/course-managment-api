import { IsString, IsNumber, IsDate, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { SubjectDto, BaseDtoGroups, TeacherDto, UserDto } from ".";
import { IsAfter, TransformDto } from "../decorators";

export class StudentDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  @TransformDto(UserDto, {
    groups: [BaseDtoGroups.RESPONSE_FULL],
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
  })
  user: UserDto;
}
