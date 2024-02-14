import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Assignment } from "../entities/Assignment.entity.js";
import { AssignmentDto } from "../dto/assignment/assignment.dto.js";
import { CreateAssignmentDto } from "../dto/assignment/create-assignment.dto.js";
import { UpdateAssignmentDto } from "../dto/assignment/update-assignment.dto.js";
import {
  FilterAssignmentDto,
  FilterAssignmentStatus,
} from "../dto/assignment/filter-assignment.dto.js";
import { LessThanOrEqual, MoreThan, Not } from "typeorm";
import type { FindOptionsWhere } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import {
  FilterStudentAssignmentCompletion,
  FilterStudentAssignmentDto,
} from "../dto/assignment/filter-student-assignment.dto.js";
import type { IAssignmentRepository } from "../interfaces/repositories/assignment-repository.interface.js";
import { injectable } from "tsyringe";
import { EnrollmentStatus } from "../entities/Enrollment.entity.js";
import { ReviewStatus } from "../entities/Review.entity.js";

@injectable()
export class AssignmentRepository implements IAssignmentRepository {
  private assignmentRepo = AppDataSource.getRepository(Assignment);

  async create(dto: CreateAssignmentDto) {
    const assignment = await this.assignmentRepo.save(dto);
    return plainToInstance(AssignmentDto, assignment, {
      exposeUnsetFields: false,
    });
  }
  async updateById(id: number, updateDto: UpdateAssignmentDto) {
    try {
      const { affected } = await this.assignmentRepo.update({ id }, updateDto);
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async deleteById(id: number) {
    try {
      const { affected } = await this.assignmentRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
  async getById(id: number) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: {
        attachments: true,
        course: true,
      },
      select: {
        id: true,
        title: true,
        text: true,
        deadline: true,
        createdAt: true,
        attachments: {
          id: true,
          fileId: true,
        },
        course: {
          id: true,
          title: true,
        },
      },
    });
    return plainToInstance(AssignmentDto, assignment, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: FilterAssignmentDto) {
    const conditions: FindOptionsWhere<Assignment> = {};
    if (filters?.teacherId)
      conditions.course = { teacherId: filters.teacherId };
    if (filters?.studentId) {
      conditions.course = {
        enrollments: {
          studentId: filters.studentId,
          status: EnrollmentStatus.ENROLLED,
        },
      };
      switch (filters.completion) {
        case FilterStudentAssignmentCompletion.COMPLETE:
          conditions.submissions = {
            studentId: filters.studentId,
            review: { status: ReviewStatus.ACCEPTED },
          };
          break;

        case FilterStudentAssignmentCompletion.INCOMPLETE:
          conditions.submissions = { studentId: Not(filters.studentId) };
          break;
      }
    }
    if (filters?.courseId) conditions.courseId = filters?.courseId;
    if (filters?.status) {
      if (filters?.status === FilterAssignmentStatus.ACTIVE)
        conditions.deadline = MoreThan(new Date());
      else if (filters?.status === FilterAssignmentStatus.INACTIVE)
        conditions.deadline = LessThanOrEqual(new Date());
    }
    const [assignments, count] = await this.assignmentRepo.findAndCount({
      where: conditions,
      relations: {
        course: true,
      },
      select: {
        id: true,
        title: true,
        course: {
          id: true,
          title: true,
        },
      },
      take: 10,
      skip: getPaginationOffset(filters?.page || 1),
    });
    return {
      assignments: plainToInstance(AssignmentDto, assignments, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  async existsWithId(id: number) {
    return this.assignmentRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }
  async isActive(id: number) {
    return this.assignmentRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .andWhere("deadline > CURRENT_TIMESTAMP")
      .getExists();
  }
}
