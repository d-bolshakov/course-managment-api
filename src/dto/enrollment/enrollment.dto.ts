import { Type } from "class-transformer";
import { EnrollmentStatus } from "../../entities";

export class EnrollmentDto {
  readonly id: number;

  readonly status: EnrollmentStatus;

  @Type(() => Date)
  readonly changedAt: Date;

  readonly courseId: number;

  readonly studentId: number;
}
