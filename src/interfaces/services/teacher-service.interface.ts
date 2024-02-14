import { CreateTeacherDto } from "../../dto/teacher/create-teacher.dto";
import { FilterTeacherDto } from "../../dto/teacher/filter-teacher.dto";
import { TeacherDto } from "../../dto/teacher/teacher.dto";
import { UpdateTeacherDto } from "../../dto/teacher/update-teacher.dto";

export interface ITeacherService {
  create(dto: CreateTeacherDto): Promise<TeacherDto>;

  getMany(options?: { filters?: FilterTeacherDto }): Promise<TeacherDto[]>;

  getById(id: number): Promise<TeacherDto>;

  update(id: number, dto: UpdateTeacherDto): Promise<TeacherDto>;

  delete(id: number): Promise<{ success: boolean }>;
}
