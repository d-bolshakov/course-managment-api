import { IsNumber, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { AssignmentDto, BaseDtoGroups, MarkDto, StudentDto } from ".";
import { TransformDto } from "../decorators";

export class SubmissionDto {
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
  @IsString({
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
    message: "comment should be a string",
  })
  comment: string;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  reviewComment: string;

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
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  status: string;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  @TransformDto(AssignmentDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public assignment: AssignmentDto;

  @Expose({
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.RESPONSE_FULL],
  })
  @IsNumber(
    {},
    {
      groups: [BaseDtoGroups.CREATE],
    }
  )
  public assignmentId: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  @TransformDto(StudentDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public student: StudentDto;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  @TransformDto(MarkDto, {
    targetDtoGroups: [BaseDtoGroups.RESPONSE_PARTIAL],
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  public mark: MarkDto;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @Type(() => Date)
  public createdAt: Date;
}
