import type { CreateTeacherDto } from "../../dto/teacher/create-teacher.dto";
import type { FilterTeacherDto } from "../../dto/teacher/filter-teacher.dto";
import type { TeacherDto } from "../../dto/teacher/teacher.dto";
import type { UpdateTeacherDto } from "../../dto/teacher/update-teacher.dto";

export interface ITeacherRepository {
  create(dto: CreateTeacherDto): Promise<TeacherDto>;
  updateById(id: number, dto: UpdateTeacherDto): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<TeacherDto | null>;
  getMany(filters?: FilterTeacherDto): Promise<TeacherDto[]>;
  existsWithId(id: number): Promise<boolean>;
}
