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
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @TransformDto(SubjectDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public subjects: SubjectDto[];

  @Expose({
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  @IsNumber(
    {},
    { each: true, groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE] }
  )
  public subjectId: number[];

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @TransformDto(UserDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public user: UserDto;
}
