import { Expose } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";

export class CreateTeacherRequestBodyDto {
  @Expose()
  @IsArray({ message: "subjectIds should be an array" })
  @IsNumber(
    {},
    { each: true, message: "each subjectId in subjectIds should be a number" }
  )
  readonly subjectIds: number[];
}
