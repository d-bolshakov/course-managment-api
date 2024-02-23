import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import {
  Enrollment,
  EnrollmentStatus,
} from "../db/entities/Enrollment.entity.js";
import { EnrollmentDto } from "../dto/enrollment/enrollment.dto.js";
import { CreateEnrollmentDto } from "../dto/enrollment/create-enrollment.dto.js";
import { FilterEnrollmentDto } from "../dto/enrollment/filter-enrollment.dto.js";
import type { FindOptionsWhere } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { UpdateEnrollmentDto } from "../dto/enrollment/update-enrollment.dto.js";
import type { IEnrollmentRepository } from "./interfaces/enrollment-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class EnrollmentRepository implements IEnrollmentRepository {
  private enrollmentRepo = AppDataSource.getRepository(Enrollment);

  async create(dto: CreateEnrollmentDto) {
    const enrollment = await this.enrollmentRepo.save(dto);
    return plainToInstance(EnrollmentDto, enrollment, {
      exposeUnsetFields: false,
    });
  }

  async updateById(id: number, updateDto: UpdateEnrollmentDto) {
    try {
      const { affected } = await this.enrollmentRepo.update({ id }, updateDto);
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async deleteById(id: number) {
    try {
      const { affected } = await this.enrollmentRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async getById(id: number) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
    return plainToInstance(EnrollmentDto, enrollment, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: FilterEnrollmentDto) {
    const conditions: FindOptionsWhere<Enrollment> = {};
    if (filters?.courseId) conditions.courseId = filters.courseId;
    if (filters?.status) conditions.status = filters.status;
    const [enrollments, count] = await this.enrollmentRepo.findAndCount({
      where: conditions,
      relations: {
        course: true,
        student: {
          user: true,
        },
      },
      select: {
        id: true,
        status: true,
        changedAt: true,
        course: {
          id: true,
          title: true,
        },
        student: {
          id: true,
          user: {
            firstName: true,
            lastName: true,
          },
        },
      },
      take: 10,
      skip: getPaginationOffset(filters?.page || 1),
    });
    return {
      enrollments: plainToInstance(EnrollmentDto, enrollments, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  existsWithId(id: number) {
    return this.enrollmentRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }

  studentHasAccess(enrollmentId: number, studentId: number): Promise<boolean> {
    return this.enrollmentRepo.exist({
      where: {
        id: enrollmentId,
        studentId,
      },
    });
  }

  teacherHasAccess(enrollmentId: number, teacherId: number): Promise<boolean> {
    return this.enrollmentRepo.exist({
      where: {
        id: enrollmentId,
        course: {
          teacherId,
        },
      },
    });
  }
}
