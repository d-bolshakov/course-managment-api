import { Type } from "class-transformer";

export class MarkDto {
  id: number;

  mark: number;

  @Type(() => Date)
  public createdAt: Date;
}
