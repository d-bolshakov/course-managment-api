import { Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateSubjectDto {
  @Expose()
  @IsString({
    message: "title should be a string",
  })
  @MinLength(2, {
    message: "title should be longer than 2 characters",
  })
  readonly title: string;
}
