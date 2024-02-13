import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";
import { FilterStudentAssignmentCompletion } from "./filter-student-assignment.dto.js";

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
  readonly status?: FilterAssignmentStatus;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "teacherId should be a number" })
  @Type(() => Number)
  readonly teacherId?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "studentId should be a number" })
  @Type(() => Number)
  readonly studentId?: number;

  @Expose()
  @IsOptional()
  @IsEnum(FilterStudentAssignmentCompletion, {
    message: "Invalid completion option",
  })
  readonly completion?: FilterStudentAssignmentCompletion;
}
