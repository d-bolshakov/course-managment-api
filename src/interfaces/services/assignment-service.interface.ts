import type { UploadedFile } from "express-fileupload";
import { CreateAssignmentDto } from "../../dto/assignment/create-assignment.dto";
import { AssignmentDto } from "../../dto/assignment/assignment.dto";
import { FilterAssignmentDto } from "../../dto/assignment/filter-assignment.dto";
import { FilterStudentAssignmentDto } from "../../dto/assignment/filter-student-assignment.dto";
import { UpdateAssignmentDto } from "../../dto/assignment/update-assignment.dto";

export interface IAssignmentService {
  create(
    dto: CreateAssignmentDto,
    attachment: UploadedFile | UploadedFile[]
  ): Promise<AssignmentDto>;

  getMany(options: { filters: FilterAssignmentDto }): Promise<AssignmentDto[]>;

  getAssignmentsOfTeacher(
    teacherId: number,
    options?: { filters: FilterAssignmentDto }
  ): Promise<AssignmentDto[]>;

  getAssignmentsOfStudent(
    studentId: number,
    options?: { filters: FilterStudentAssignmentDto }
  ): Promise<AssignmentDto[]>;

  getFullDataById(id: number): Promise<AssignmentDto>;

  update(id: number, dto: UpdateAssignmentDto): Promise<AssignmentDto | null>;

  delete(id: number): Promise<{ message: string }>;
}
