import { Expose } from "class-transformer";
import { EnrollmentStatus } from "../../entities/Enrollment.entity.js";
import { IsEnum, NotEquals } from "class-validator";

export class UpdateEnrollmentDto {
  @Expose()
  @IsEnum(EnrollmentStatus, { message: "Invalid status" })
  @NotEquals(EnrollmentStatus.APPLIED, { message: "Invalid status" })
  readonly status: EnrollmentStatus;
}
