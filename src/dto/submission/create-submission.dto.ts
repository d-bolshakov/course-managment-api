import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubmissionDto {
  @Expose()
  @IsOptional()
  @IsNumber(
    {},
    {
      message: "studentId should be a number",
    }
  )
  @Type(() => Number)
  readonly studentId?: number;

  @Expose()
  @IsNumber(
    {},
    {
      message: "assignmentd should be a number",
    }
  )
  @Type(() => Number)
  readonly assignmentId: number;

  @Expose()
  @IsString({
    message: "comment should be a string",
  })
  readonly comment: string;

  @Expose()
  @IsString({
    message: "text should be a string",
  })
  readonly text: string;
}
