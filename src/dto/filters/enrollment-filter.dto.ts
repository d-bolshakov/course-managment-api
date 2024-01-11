import { IsDate, IsEnum, IsNumber, IsString, MinDate } from "class-validator";
import { Expose, Type } from "class-transformer";
import { BaseDtoGroups, CourseDto, StudentDto } from "..";
import { TransformDto } from "../../decorators";
import { Status } from "../../entities";

export class EnrollmentFilterDto {
  @Expose()
  @IsEnum(Status, { message: "Invalid status" })
  status: Status;

  @Expose()
  @IsNumber({}, { message: "courseId should be a number" })
  @Type(() => Number)
  courseId: number;
}
