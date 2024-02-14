import { StudentDto } from "../../dto/student/student.dto";

export interface IStudentService {
  create(userId: number): Promise<StudentDto>;

  getMany(options?: { filters: { page: number } }): Promise<StudentDto[]>;

  getById(id: number): Promise<StudentDto>;

  delete(id: number): Promise<{ success: boolean }>;
}
