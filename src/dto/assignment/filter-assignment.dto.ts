import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";

export enum FilterAssignmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export class FilterAssignmentDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsEnum(FilterAssignmentStatus, { message: "Invalid status" })
  readonly status: FilterAssignmentStatus;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;
}
