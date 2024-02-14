import type { CreateSubmissionDto } from "../../dto/submission/create-submission.dto";
import type { FilterSubmissionDto } from "../../dto/submission/filter-submission.dto";
import type { SubmissionDto } from "../../dto/submission/submission.dto";
import type { UpdateSubmissionDto } from "../../dto/submission/update-submission.dto";

export interface ISubmissionRepository {
  create(dto: CreateSubmissionDto): Promise<SubmissionDto>;
  updateById(
    id: number,
    updateDto: UpdateSubmissionDto
  ): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<SubmissionDto | null>;
  getMany(
    filters?: FilterSubmissionDto
  ): Promise<{ submissions: SubmissionDto[]; count: number }>;
  existsWithId(id: number): Promise<boolean>;
}
