import { IsString, IsNumber, IsDate, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { SubjectDto, BaseDtoGroups, TeacherDto } from "./";
import { IsAfter, TransformDto } from "../decorators/";

export class CourseDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({ groups: [BaseDtoGroups.RESPONSE_FULL] })
  @TransformDto(TeacherDto, {
    groups: [BaseDtoGroups.RESPONSE_FULL],
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
  })
  teacher: TeacherDto;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @IsString({
    message: "title should be a string",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  public title: string;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @TransformDto(SubjectDto, {
    groups: [BaseDtoGroups.RESPONSE_FULL],
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
  })
  public subject: SubjectDto;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
      BaseDtoGroups.RESPONSE_PARTIAL,
    ],
  })
  @IsNumber(
    {},
    {
      message: "subjectId should be a number",
      groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
    }
  )
  public subjectId: number;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @IsNumber(
    {},
    {
      message: "maxStudents should be a number",
      groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
    }
  )
  public maxStudents: number;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @Type(() => Date)
  @IsDate({
    message: "startsAt should be a date",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  @MinDate(new Date(), {
    message: "startsAt should be later than now",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  public startsAt: Date;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @Type(() => Date)
  @IsDate({
    message: "endsAt should be a date",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  @IsAfter("startsAt", {
    message: "endsAt should be later than now",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  public endsAt: Date;
}
