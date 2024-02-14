import { MarkDto } from "../../dto/mark/mark.dto";

export interface IMarkService {
  create(dto: { mark: number }): Promise<MarkDto>;

  delete(id: number): Promise<{ success: boolean }>;
}
