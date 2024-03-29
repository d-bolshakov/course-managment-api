import { CreateSubjectDto } from "../../../dto/subject/create-subject.dto";
import type { FilterSubjectDto } from "../../../dto/subject/filter-subject.dto";
import { SubjectDto } from "../../../dto/subject/subject.dto";
import { UpdateSubjectDto } from "../../../dto/subject/update-subject.dto";

export interface ISubjectService {
  create(dto: CreateSubjectDto): Promise<SubjectDto>;

  getMany(options?: {
    filters?: FilterSubjectDto;
  }): Promise<{ subjects: SubjectDto[]; count: number }>;

  getById(id: number): Promise<SubjectDto>;

  update(id: number, dto: UpdateSubjectDto): Promise<SubjectDto | null>;

  delete(id: number): Promise<{ success: boolean }>;
}
