import { StudentDto } from "../../dto/student/student.dto";

export interface IStudentService {
  create(userId: number): Promise<StudentDto>;

  getMany(options?: { filters: { page: number } }): Promise<StudentDto[]>;

  getFullDataById(id: number): Promise<StudentDto>;
}
