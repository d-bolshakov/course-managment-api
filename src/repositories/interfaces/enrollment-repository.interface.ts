import type { CreateEnrollmentDto } from "../../dto/enrollment/create-enrollment.dto";
import type { EnrollmentDto } from "../../dto/enrollment/enrollment.dto";
import type { FilterEnrollmentDto } from "../../dto/enrollment/filter-enrollment.dto";
import type { UpdateEnrollmentDto } from "../../dto/enrollment/update-enrollment.dto";

export interface IEnrollmentRepository {
  create(dto: CreateEnrollmentDto): Promise<EnrollmentDto>;
  updateById(
    id: number,
    updateDto: UpdateEnrollmentDto
  ): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<EnrollmentDto | null>;
  getMany(
    filters?: FilterEnrollmentDto
  ): Promise<{ enrollments: EnrollmentDto[]; count: number }>;
  existsWithId(id: number): Promise<boolean>;
  studentHasAccess(enrollmentId: number, studentId: number): Promise<boolean>;
  teacherHasAccess(enrollmentId: number, teacherId: number): Promise<boolean>;
}
