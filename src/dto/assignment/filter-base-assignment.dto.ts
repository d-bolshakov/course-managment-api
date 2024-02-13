import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";
import { FilterAssignmentStatus } from "./filter-assignment.dto.js";

export class FilterBaseAssignmentDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsEnum(FilterAssignmentStatus, { message: "Invalid status" })
  readonly status?: FilterAssignmentStatus;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId?: number;
}
