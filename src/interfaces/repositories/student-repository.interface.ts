import type { StudentDto } from "../../dto/student/student.dto";

export interface IStudentRepository {
  create(dto: { userId: number }): Promise<StudentDto>;
  getById(id: number): Promise<StudentDto | null>;
  getMany(filters?: { page: number }): Promise<StudentDto[]>;
  deleteById(id: number): Promise<{ success: boolean }>;
  existsWithUserId(userId: number): Promise<boolean>;
}
