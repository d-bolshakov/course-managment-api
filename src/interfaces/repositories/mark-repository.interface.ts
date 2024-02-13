import type { CreateMarkDto } from "../../dto/mark/create-mark.dto";
import type { MarkDto } from "../../dto/mark/mark.dto";

export interface IMarkRepository {
  create(dto: CreateMarkDto): Promise<MarkDto>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<MarkDto | null>;
  getMany(): Promise<MarkDto[]>;
  existsWithId(id: number): Promise<boolean>;
}
