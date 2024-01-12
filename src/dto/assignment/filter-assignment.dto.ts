import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export enum FilterAssignmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export class FilterAssignmentDto {
  @IsOptional()
  @IsEnum(FilterAssignmentStatus, { message: "Invalid status" })
  readonly status: FilterAssignmentStatus;

  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;
}
