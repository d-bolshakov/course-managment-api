import { IsNumber } from "class-validator";

export class CreateTeacherDto {
  @IsNumber({}, { each: true, message: "each subjectId should be a number" })
  readonly subjectId: number[];
}
