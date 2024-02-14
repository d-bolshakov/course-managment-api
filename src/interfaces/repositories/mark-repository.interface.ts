import type { CreateMarkDto } from "../../dto/mark/create-mark.dto";
import type { MarkDto } from "../../dto/mark/mark.dto";

export interface IMarkRepository {
  create(dto: CreateMarkDto): Promise<MarkDto>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<MarkDto | null>;
  getMany(): Promise<{ marks: MarkDto[]; count: number }>;
  existsWithId(id: number): Promise<boolean>;
}
