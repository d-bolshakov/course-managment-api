import { EnrollmentDto } from "../../dto/enrollment/enrollment.dto";
import { FilterEnrollmentDto } from "../../dto/enrollment/filter-enrollment.dto";

export interface IEnrollmentService {
  create(courseId: number, studentId: number): Promise<EnrollmentDto>;

  getMany(options: {
    filters: FilterEnrollmentDto;
  }): Promise<{ enrollments: EnrollmentDto[]; count: number }>;

  getById(id: number): Promise<EnrollmentDto>;

  update(id: number, dto: any): Promise<EnrollmentDto | null>;

  delete(id: number): Promise<{ success: boolean }>;
}
