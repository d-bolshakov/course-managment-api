import { IsDate, IsNumber, IsString, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { BaseDtoGroups, CourseDto } from ".";
import { TransformDto } from "../decorators";

export class AssignmentDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
      BaseDtoGroups.RESPONSE_PARTIAL,
    ],
  })
  @IsString({
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
    message: "title should be a string",
  })
  title: string;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @IsString({
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
    message: "text should be a string",
  })
  text: string;

  @Expose({
    groups: [
      BaseDtoGroups.CREATE,
      BaseDtoGroups.UPDATE,
      BaseDtoGroups.RESPONSE_FULL,
    ],
  })
  @Type(() => Date)
  @IsDate({
    message: "deadline should be a date",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  @MinDate(new Date(), {
    message: "deadline should be later than now",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  public deadline: Date;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  @TransformDto(CourseDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public course: CourseDto;

  @Expose({
    groups: [BaseDtoGroups.CREATE],
  })
  @IsNumber(
    {},
    {
      groups: [BaseDtoGroups.CREATE],
    }
  )
  public courseId: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @Type(() => Date)
  public createdAt: Date;
}
