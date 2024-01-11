import { IsEnum, IsNumber } from "class-validator";
import { Expose, Type } from "class-transformer";
import { SubmissionStatus } from "../../entities";

export class SubmissionFilterDto {
  @Expose()
  @IsEnum(SubmissionStatus, { message: "Invalid status" })
  status: SubmissionStatus;

  // @Expose()
  // @IsEnum(SubmissionStatus, { each: true, message: "Invalid status" })
  // status: SubmissionStatus[];

  @Expose()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  courseId: number;

  @Expose()
  @IsNumber({}, { message: "assaignmentId should be a number" })
  @Type(() => Number)
  assignmentId: number;
}
