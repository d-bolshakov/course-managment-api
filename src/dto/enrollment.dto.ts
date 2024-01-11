import { IsDate, IsNumber, IsString, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { BaseDtoGroups, CourseDto, StudentDto } from ".";
import { TransformDto } from "../decorators";

export class EnrollmentDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  status: string;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @Type(() => Date)
  changedAt: Date;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  courseId: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  studentId: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @TransformDto(StudentDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public student: StudentDto;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @TransformDto(CourseDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public course: CourseDto;
}
