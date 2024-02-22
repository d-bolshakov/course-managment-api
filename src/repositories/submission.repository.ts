import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Submission } from "../db/entities/Submission.entity.js";
import { SubmissionDto } from "../dto/submission/submission.dto.js";
import { CreateSubmissionDto } from "../dto/submission/create-submission.dto.js";
import {
  FilterSubmissionDto,
  FilterSubmissionstatus,
} from "../dto/submission/filter-submission.dto.js";
import { IsNull } from "typeorm";
import type { FindOptionsWhere } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { UpdateSubmissionDto } from "../dto/submission/update-submission.dto.js";
import type { ISubmissionRepository } from "../interfaces/repositories/submission-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class SubmissionRepository implements ISubmissionRepository {
  private submissionRepo = AppDataSource.getRepository(Submission);

  async create(dto: CreateSubmissionDto) {
    const submission = await this.submissionRepo.save(dto);
    return plainToInstance(SubmissionDto, submission, {
      exposeUnsetFields: false,
    });
  }

  async updateById(id: number, updateDto: UpdateSubmissionDto) {
    try {
      const { affected } = await this.submissionRepo.update({ id }, updateDto);
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async deleteById(id: number) {
    try {
      const { affected } = await this.submissionRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async getById(id: number) {
    const submission = await this.submissionRepo.findOne({
      where: { id },
      relations: {
        assignment: true,
        review: {
          mark: true,
        },
        attachments: true,
      },
      select: {
        id: true,
        text: true,
        comment: true,
        createdAt: true,
        assignment: {
          id: true,
          title: true,
        },
        studentId: true,
        review: {
          id: true,
          status: true,
          createdAt: true,
          comment: true,
          mark: {
            id: true,
            mark: true,
          },
        },
        attachments: {
          id: true,
          fileId: true,
        },
      },
    });
    return plainToInstance(SubmissionDto, submission, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: FilterSubmissionDto) {
    const conditions: FindOptionsWhere<Submission> = {};
    if (filters?.teacherId)
      conditions.assignment = { course: { teacherId: filters.teacherId } };
    else if (filters?.studentId) conditions.studentId = filters.studentId;
    if (filters?.assignmentId) conditions.assignmentId = filters.assignmentId;
    if (filters?.courseId)
      conditions.assignment = {
        ...(conditions.assignment as any),
        courseId: filters.courseId,
      };
    if (filters?.status === FilterSubmissionstatus.SUMBITTED)
      conditions.reviewId = IsNull();
    else if (
      filters?.status === FilterSubmissionstatus.ACCEPTED ||
      filters?.status === FilterSubmissionstatus.REJECTED
    )
      conditions.review = { status: filters?.status as any };
    const [submissions, count] = await this.submissionRepo.findAndCount({
      where: conditions,
      relations: {
        assignment: {
          course: true,
        },
        student: {
          user: true,
        },
      },
      select: {
        id: true,
        reviewId: true,
        assignment: {
          id: true,
          courseId: true,
          course: {
            id: true,
            title: true,
          },
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
      submissions: plainToInstance(SubmissionDto, submissions, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  existsWithId(id: number) {
    return this.submissionRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }

  countSubmissionsForAssignment(assignmentId: number): Promise<number> {
    return this.submissionRepo.count({ where: { assignmentId } });
  }

  studentHasAccess(submissionId: number, studentId: number): Promise<boolean> {
    return this.submissionRepo.exist({
      where: {
        id: submissionId,
        studentId,
      },
    });
  }

  teacherHasAccess(submissionId: number, teacherId: number): Promise<boolean> {
    return this.submissionRepo.exist({
      where: {
        id: submissionId,
        assignment: {
          course: {
            teacherId,
          },
        },
      },
    });
  }
}
