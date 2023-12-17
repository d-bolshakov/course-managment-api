import { IsNumber } from "class-validator";
import { Expose } from "class-transformer";
import { SubjectDto, BaseDtoGroups, UserDto } from "./";
import { TransformDto } from "../decorators/";

export class TeacherDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @IsNumber(
    {},
    { each: true, groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE] }
  )
  @TransformDto(SubjectDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public subjects: number[] | SubjectDto[];

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @TransformDto(UserDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public user: UserDto;
}
