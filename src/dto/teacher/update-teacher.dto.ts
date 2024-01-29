import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";

export class UpdateTeacherDto {
  @Expose()
  @IsNumber({}, { each: true, message: "each subjectId should be a number" })
  readonly subjectIds: number[];
}
