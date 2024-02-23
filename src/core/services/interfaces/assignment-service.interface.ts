import type { UploadedFile } from "express-fileupload";
import { CreateAssignmentDto } from "../../../dto/assignment/create-assignment.dto";
import { AssignmentDto } from "../../../dto/assignment/assignment.dto";
import { FilterStudentAssignmentDto } from "../../../dto/assignment/filter-student-assignment.dto";
import type { FilterBaseAssignmentDto } from "../../../dto/assignment/filter-base-assignment.dto";
import type { UpdateAssignmentRequestBodyDto } from "../../../dto/assignment/update-assignment-request-body.dto";

export interface IAssignmentService {
  create(
    dto: CreateAssignmentDto,
    attachment?: UploadedFile | UploadedFile[]
  ): Promise<AssignmentDto>;

  getMany(options: {
    filters: FilterBaseAssignmentDto;
  }): Promise<{ assignments: AssignmentDto[]; count: number }>;

  getAssignmentsOfTeacher(
    teacherId: number,
    options?: { filters: FilterBaseAssignmentDto }
  ): Promise<{ assignments: AssignmentDto[]; count: number }>;

  getAssignmentsOfStudent(
    studentId: number,
    options?: { filters: FilterStudentAssignmentDto }
  ): Promise<{ assignments: AssignmentDto[]; count: number }>;

  getById(id: number): Promise<AssignmentDto>;

  update(
    id: number,
    dto: UpdateAssignmentRequestBodyDto,
    attachment?: UploadedFile | UploadedFile[]
  ): Promise<AssignmentDto | null>;

  delete(id: number): Promise<{ success: boolean }>;
}
