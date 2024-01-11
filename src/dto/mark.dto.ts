import { Expose, Type } from "class-transformer";
import { BaseDtoGroups, StudentDto, CourseDto } from ".";
import { TransformDto } from "../decorators";
import { IsNumber } from "class-validator";

export class MarkDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  mark: number;

  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL],
  })
  @Type(() => Date)
  public createdAt: Date;
}
