import { IsDate, IsEnum, IsNumber, IsString, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { BaseDtoGroups, CourseDto, StudentDto } from "..";
import { TransformDto } from "../../decorators";
import { Status } from "../../entities";

export enum AssignmentFilterStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export class AssignmentFilterDto {
  @Expose()
  @IsEnum(AssignmentFilterStatus, { message: "Invalid status" })
  status: AssignmentFilterStatus;

  @Expose()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  courseId: number;
}
