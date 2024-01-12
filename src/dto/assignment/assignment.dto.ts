import { Type } from "class-transformer";

export class AssignmentDto {
  readonly id: number;

  readonly title: string;

  readonly text: string;

  @Type(() => Date)
  readonly deadline: Date;

  readonly courseId: number;

  @Type(() => Date)
  readonly createdAt: Date;
}
