import type { AssignmentDto } from "../../dto/assignment/assignment.dto";
import type { CreateAssignmentDto } from "../../dto/assignment/create-assignment.dto";
import type { FilterAssignmentDto } from "../../dto/assignment/filter-assignment.dto";
import type { UpdateAssignmentDto } from "../../dto/assignment/update-assignment.dto";

export interface IAssignmentRepository {
  create(dto: CreateAssignmentDto): Promise<AssignmentDto>;
  updateById(
    id: number,
    updateDto: UpdateAssignmentDto
  ): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<AssignmentDto | null>;
  getMany(
    filters?: FilterAssignmentDto
  ): Promise<{ assignments: AssignmentDto[]; count: number }>;
  existsWithId(id: number): Promise<boolean>;
  isActive(id: number): Promise<boolean>;
  studentHasAccess(assignmentId: number, studentId: number): Promise<boolean>;
  teacherHasAccess(assignmentId: number, teacherId: number): Promise<boolean>;
}
