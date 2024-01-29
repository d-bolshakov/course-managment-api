import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Expose, Type } from "class-transformer";
import { EnrollmentStatus } from "../../entities/Enrollment.entity.js";

export class FilterEnrollmentDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;

  @Expose()
  @IsOptional()
  @IsEnum(EnrollmentStatus, { message: "Invalid status" })
  readonly status: EnrollmentStatus;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;
}
