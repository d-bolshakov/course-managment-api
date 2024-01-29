import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { FindOptionsSelect, FindOptionsWhere, IsNull } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";

import { UploadedFile } from "express-fileupload";
import { plainToInstance } from "class-transformer";
import { CreateReviewDto } from "../dto/review/create-review.dto.js";
import { CreateSubmissionDto } from "../dto/submission/create-submission.dto.js";
import {
  FilterSubmissionDto,
  FilterSubmissionstatus,
} from "../dto/submission/filter-submission.dto.js";
import { SubmissionDto } from "../dto/submission/submission.dto.js";
import { Submission } from "../entities/Submission.entity.js";
import { assignmentService } from "./assignment.service.js";
import { attachmentService } from "./attachment.service.js";
import { reviewService } from "./review.service.js";

class SubmissionService {
  private submissionRepository = AppDataSource.getRepository(Submission);

  async create(
    dto: CreateSubmissionDto,
    studentId: number,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    if (!(await assignmentService.isActive(dto.assignmentId)))
      throw createError.BadRequest(
        "Could not create submission for an inactive assignment"
      );
    const submission = this.submissionRepository.create({
      ...dto,
      studentId,
      assignmentId: dto.assignmentId,
    });
    const saved = await this.submissionRepository.save(submission);
    let savedAttachments;
    if (attachment)
      savedAttachments = await attachmentService.createForSubmission(
        saved.id,
        attachment
      );
    return plainToInstance(
      SubmissionDto,
      { ...submission, attachments: savedAttachments },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async getMany(options: { filters: FilterSubmissionDto }) {
    const { assignmentId, courseId, status } = options.filters;
    const conditions: FindOptionsWhere<Submission> = {};
    if (assignmentId) conditions.assignment = { id: assignmentId };
    if (courseId) conditions.assignment = { course: { id: courseId } };
    if (status === FilterSubmissionstatus.SUMBITTED)
      conditions.reviewId = IsNull();
    else if (
      status === FilterSubmissionstatus.ACCEPTED ||
      status === FilterSubmissionstatus.REJECTED
    )
      conditions.review = { status: status as any };
    const submissions = await this.submissionRepository.find({
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
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(SubmissionDto, submissions, {
      exposeUnsetFields: false,
    });
  }

  async getSubmissionsOfTeacher(
    teacherId: number,
    options?: {
      filters: FilterSubmissionDto;
    }
  ) {
    const conditions: FindOptionsWhere<Submission> = {
      assignment: { course: { teacherId } },
    };
    if (options?.filters.assignmentId)
      conditions.assignmentId = options.filters.assignmentId;
    if (options?.filters.courseId)
      // @ts-expect-error
      conditions.assignment!.courseId = options.filters.courseId;
    if (options?.filters.status === FilterSubmissionstatus.SUMBITTED)
      conditions.reviewId = IsNull();
    else if (
      options?.filters.status === FilterSubmissionstatus.ACCEPTED ||
      options?.filters.status === FilterSubmissionstatus.REJECTED
    )
      conditions.review = { status: options.filters.status as any };
    const submissions = await this.submissionRepository.find({
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
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(SubmissionDto, submissions, {
      exposeUnsetFields: false,
    });
  }

  async getSubmissionsOfStudent(
    studentId: number,
    options?: {
      filters: FilterSubmissionDto;
    }
  ) {
    const conditions: FindOptionsWhere<Submission> = {
      assignment: { course: { enrollments: { studentId } } },
    };
    if (options?.filters.assignmentId)
      conditions.assignmentId = options.filters.assignmentId;
    if (options?.filters.courseId)
      // @ts-expect-error
      conditions.assignment!.courseId = options.filters.courseId;
    if (options?.filters.status === FilterSubmissionstatus.SUMBITTED)
      conditions.reviewId = IsNull();
    else if (
      options?.filters.status === FilterSubmissionstatus.ACCEPTED ||
      options?.filters.status === FilterSubmissionstatus.REJECTED
    )
      conditions.review = { status: options.filters.status as any };
    const submissions = await this.submissionRepository.find({
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
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(SubmissionDto, submissions, {
      exposeUnsetFields: false,
    });
  }

  async getFullDataById(id: number) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: {
        assignment: {
          course: true,
        },
        student: {
          user: true,
        },
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
    if (!submission)
      throw new createError.NotFound(`Submission with id ${id} does not exist`);
    return plainToInstance(SubmissionDto, submission, {
      exposeUnsetFields: false,
    });
  }

  async review(id: number, dto: CreateReviewDto) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
    });
    if (!submission)
      throw new createError.NotFound(`Submission with id ${id} does not exist`);
    if (submission.reviewId)
      throw createError.BadRequest(
        `Submission with id ${id} has review already`
      );
    const review = await reviewService.create(dto);
    submission.reviewId = review.id;
    await this.submissionRepository.save(submission);
    return plainToInstance(
      SubmissionDto,
      { ...submission, review },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async delete(id: number) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
    });
    if (!submission)
      throw new createError.NotFound(`Submission with id ${id} does not exist`);
    await this.submissionRepository.remove(submission);
    return { message: `Submission with id ${id} was deleted successfully` };
  }
}

export const submissionService = new SubmissionService();
