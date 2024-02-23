import type { CreateSubjectDto } from "../../dto/subject/create-subject.dto";
import type { FilterSubjectDto } from "../../dto/subject/filter-subject.dto";
import type { SubjectDto } from "../../dto/subject/subject.dto";
import type { UpdateSubjectDto } from "../../dto/subject/update-subject.dto";

export interface ISubjectRepository {
  create(dto: CreateSubjectDto): Promise<SubjectDto>;
  updateById(
    id: number,
    updateDto: UpdateSubjectDto
  ): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<SubjectDto | null>;
  getByTitle(title: string): Promise<SubjectDto | null>;
  getMany(
    filters?: FilterSubjectDto
  ): Promise<{ subjects: SubjectDto[]; count: number }>;
  getManyByIds(ids: number[]): Promise<SubjectDto[]>;
  existsWithId(id: number | number[]): Promise<boolean>;
}
