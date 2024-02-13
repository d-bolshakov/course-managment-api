import { Expose } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

export class CreateTeacherDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "userId should be a number" })
  readonly userId: number;

  @Expose()
  @IsArray({ message: "subjectIds should be an array" })
  @IsNumber(
    {},
    { each: true, message: "each subjectId in subjectIds should be a number" }
  )
  readonly subjectIds: number[];
}
