import { Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { BaseDtoGroups } from "./";

export class SubjectDto {
  @Expose({
    groups: [BaseDtoGroups.RESPONSE_FULL, BaseDtoGroups.RESPONSE_PARTIAL],
  })
  id?: number;

  @Expose({
    groups: Object.values(BaseDtoGroups),
  })
  @IsString({
    message: "Title should be a string",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  @MinLength(2, {
    message: "Title should be longer than 2 characters",
    groups: [BaseDtoGroups.CREATE, BaseDtoGroups.UPDATE],
  })
  public title: string;
}
