import createError from "http-errors";
import type { UploadedFile } from "express-fileupload";
import { plainToInstance } from "class-transformer";
import { ReviewSubmissionDto } from "../dto/submission/review-submission.dto.js";
import { CreateSubmissionDto } from "../dto/submission/create-submission.dto.js";
import { FilterSubmissionDto } from "../dto/submission/filter-submission.dto.js";
import { SubmissionDto } from "../dto/submission/submission.dto.js";
import type { ISubmissionService } from "../interfaces/services/submission-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { IAssignmentRepository } from "../interfaces/repositories/assignment-repository.interface.js";
import type { ISubmissionRepository } from "../interfaces/repositories/submission-repository.interface.js";
import type { IReviewService } from "../interfaces/services/review-service.interface.js";
import type { IAttachmentService } from "../interfaces/services/attachment-service.interface.js";

@injectable()
export class SubmissionService implements ISubmissionService {
  constructor(
    @inject("submission-repository")
    private submissionRepository: ISubmissionRepository,
    @inject("assignment-repository")
    private assignmentRepository: IAssignmentRepository,
    @inject("review-service")
    private reviewService: IReviewService,
    @inject("submission-attachment-service")
    private attachmentService: IAttachmentService
  ) {}

  async create(
    studentId: number,
    dto: CreateSubmissionDto,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    if (!(await this.assignmentRepository.isActive(dto.assignmentId)))
      throw createError.BadRequest(
        "Could not create submission for an inactive assignment"
      );
    const submission = await this.submissionRepository.create({
      ...dto,
      studentId,
      assignmentId: dto.assignmentId,
    });
    let savedAttachments;
    if (attachment)
      savedAttachments = await this.attachmentService.create(
        submission.id,
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

  async getMany(options?: { filters: FilterSubmissionDto }) {
    return this.submissionRepository.getMany(options?.filters);
  }

  async getSubmissionsOfTeacher(
    teacherId: number,
    options?: {
      filters: FilterSubmissionDto;
    }
  ) {
    return this.submissionRepository.getSubmissionsOfTeacher(
      teacherId,
      options?.filters
    );
  }

  async getSubmissionsOfStudent(
    studentId: number,
    options?: {
      filters: FilterSubmissionDto;
    }
  ) {
    return this.submissionRepository.getSubmissionsOfStudent(
      studentId,
      options?.filters
    );
  }

  async getFullDataById(id: number) {
    const submission = await this.submissionRepository.getFullDataById(id);
    if (!submission)
      throw createError.NotFound(`Submission with id ${id} does not exist`);
    return plainToInstance(SubmissionDto, submission, {
      exposeUnsetFields: false,
    });
  }

  async review(id: number, dto: ReviewSubmissionDto) {
    const submission = await this.submissionRepository.getById(id);
    if (!submission)
      throw createError.NotFound(`Submission with id ${id} does not exist`);
    if (submission.reviewId)
      throw createError.BadRequest(
        `Submission with id ${id} has review already`
      );
    const review = await this.reviewService.create(dto);
    const { success: isUpdated } = await this.submissionRepository.updateById(
      id,
      { reviewId: review.id }
    );
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during updating submission with id ${id}`
      );
    return review;
  }

  async delete(id: number) {
    const exists = await this.submissionRepository.existsWithId(id);
    if (!exists)
      throw createError.NotFound(`Submission with id ${id} does not exist`);
    const { success: isDeleted } = await this.submissionRepository.deleteById(
      id
    );
    if (!isDeleted)
      throw createError.InternalServerError(
        `Something went wrong during deleteding submission with id ${id}`
      );
    return { message: `Submission with id ${id} was deleted successfully` };
  }
}
