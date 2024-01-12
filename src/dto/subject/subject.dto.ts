import { IsString, MinLength } from "class-validator";

export class SubjectDto {
  readonly id: number;

  @IsString({
    message: "title should be a string",
  })
  @MinLength(2, {
    message: "title should be longer than 2 characters",
  })
  public title: string;
}
