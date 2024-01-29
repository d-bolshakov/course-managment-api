import { Exclude, Expose, Transform, Type } from "class-transformer";
import { EnrollmentDto } from "../enrollment/enrollment.dto.js";
import { SubmissionDto } from "../submission/submission.dto.js";
import { UserDto } from "../user/user.dto.js";

export class StudentDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly userId: number;

  @Exclude()
  @Type(() => UserDto)
  readonly user: () => UserDto;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.email)
  readonly email?: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.firstName)
  readonly firstName?: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.lastName)
  readonly lastName?: string;

  @Expose()
  @Type(() => EnrollmentDto)
  readonly enrollments: EnrollmentDto[];

  @Expose()
  @Type(() => SubmissionDto)
  readonly submissions: SubmissionDto[];
}
