import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FilterSubjectDto {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "page should be a number" })
  @Type(() => Number)
  readonly page?: number;
}
