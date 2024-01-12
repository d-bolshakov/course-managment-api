import { Type } from "class-transformer";

export class CourseDto {
  readonly id: number;

  readonly title: string;

  readonly subjectId: number;

  readonly maxStudents: number;

  @Type(() => Date)
  readonly startsAt: Date;

  @Type(() => Date)
  readonly endsAt: Date;
}
