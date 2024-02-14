import type { UploadedFile } from "express-fileupload";
import { CreateAssignmentDto } from "../../dto/assignment/create-assignment.dto";
import { AssignmentDto } from "../../dto/assignment/assignment.dto";
import { FilterStudentAssignmentDto } from "../../dto/assignment/filter-student-assignment.dto";
import { UpdateAssignmentDto } from "../../dto/assignment/update-assignment.dto";
import type { FilterBaseAssignmentDto } from "../../dto/assignment/filter-base-assignment.dto";

export interface IAssignmentService {
  create(
    dto: CreateAssignmentDto,
    attachment: UploadedFile | UploadedFile[]
  ): Promise<AssignmentDto>;

  getMany(options: {
    filters: FilterBaseAssignmentDto;
  }): Promise<AssignmentDto[]>;

  getAssignmentsOfTeacher(
    teacherId: number,
    options?: { filters: FilterBaseAssignmentDto }
  ): Promise<AssignmentDto[]>;

  getAssignmentsOfStudent(
    studentId: number,
    options?: { filters: FilterStudentAssignmentDto }
  ): Promise<AssignmentDto[]>;

  getById(id: number): Promise<AssignmentDto>;

  update(id: number, dto: UpdateAssignmentDto): Promise<AssignmentDto | null>;

  delete(id: number): Promise<{ success: boolean }>;
}
