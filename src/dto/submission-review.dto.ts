import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { AssignmentDto, BaseDtoGroups, MarkDto, StudentDto } from ".";
import { TransformDto } from "../decorators";
import { SubmissionStatus } from "../entities";

export class SubmissionReviewDto {
  @Expose({
    groups: [BaseDtoGroups.CREATE],
  })
  @IsOptional({ groups: [BaseDtoGroups.CREATE] })
  @IsString({
    groups: [BaseDtoGroups.CREATE],
    message: "comment should be a string",
  })
  comment: string;

  @Expose({
    groups: [BaseDtoGroups.CREATE],
  })
  @IsEnum(SubmissionStatus, { message: "Invalid status" })
  @NotEquals(SubmissionStatus.SUBMITTED)
  status: SubmissionStatus;

  @Expose({
    groups: [BaseDtoGroups.CREATE],
  })
  @IsOptional({ groups: [BaseDtoGroups.CREATE] })
  @IsNumber(
    {},
    { groups: [BaseDtoGroups.CREATE], message: "mark should be a number" }
  )
  public mark: number;
}
