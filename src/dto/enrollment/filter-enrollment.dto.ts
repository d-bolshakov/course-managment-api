import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { EnrollmentStatus } from "../../entities";

export class FilterEnrollmentDto {
  @IsOptional()
  @IsEnum(EnrollmentStatus, { message: "Invalid status" })
  readonly status: EnrollmentStatus;

  @IsOptional()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  readonly courseId: number;
}
