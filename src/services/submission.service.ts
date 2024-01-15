import { AppDataSource } from "../db/data-source";
import { BadRequest, Forbidden } from "http-errors";
import { Submission, User } from "../entities";
import {
  assignmentService,
  attachmentService,
  markService,
  studentService,
} from ".";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";
import { CreateSubmissionDto, MarkDto, CreateReviewDto } from "../dto";
import { FilterSubmissionDto } from "../dto/";
import { UploadedFile } from "express-fileupload";

class SubmissionService {
  private submissionRepository = AppDataSource.getRepository(Submission);

  async create(
    assignmentId: number,
    dto: CreateSubmissionDto,
    user: User,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    const { text, comment } = dto;
    const candidateAssignment = await assignmentService.getById(assignmentId);
    const studentProfile = await studentService.getByUserId(user.id, {
      relations: {
        enrollments: true,
      },
    });
    if (
      !studentProfile.enrollments.find(
        (e) => e.courseId === candidateAssignment.courseId
      )
    )
      throw new Forbidden();
    if (candidateAssignment.deadline! < new Date())
      throw BadRequest("Could not create submission after the deadline");
    const submission = new Submission();
    submission.student = studentProfile;
    submission.assignment = candidateAssignment;
    submission.text = text;
    submission.comment = comment;
    const saved = await this.submissionRepository.save(submission);
    if (attachment)
      submission.attachments = await attachmentService.createForSubmission(
        saved,
        attachment
      );
    return submission;
  }

  async getOne(
    conditions: FindOptionsWhere<Submission>,
    options?: {
      relations?: FindOptionsRelations<Submission>;
      select?: FindOptionsSelect<Submission>;
    }
  ) {
    return this.submissionRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options: {
    filters: FilterSubmissionDto;
    relations?: FindOptionsRelations<Submission>;
    select?: FindOptionsSelect<Submission>;
    page?: number;
  }) {
    const { assignmentId, courseId } = options.filters;
    const conditions: FindOptionsWhere<Submission> = {};
    if (assignmentId) conditions.assignment = { id: assignmentId };
    if (courseId) conditions.assignment = { course: { id: courseId } };
    const findOptions: FindManyOptions<Submission> = {
      where: conditions,
      relations: options?.relations,
      select: options.select,
    };
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);
    return this.submissionRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Submission>;
      select?: FindOptionsSelect<Submission>;
    }
  ) {
    const submission = await this.getOne({ id }, options);
    if (!submission)
      throw new BadRequest(`Submission with id ${id} does not exist`);
    return submission;
  }

  // async review(id: number, dto: CreateSubmissionReviewDto, user: User) {
  //   const submission = await this.getById(id);
  //   const { status, comment, mark } = dto;
  //   if (status === SubmissionStatus.REJECTED) {
  //     submission.status = status;
  //     submission.reviewComment = comment;
  //     await this.submissionRepository.save(submission);
  //     return submission;
  //   }
  //   const createdMark = await markService.create({ mark } as MarkDto);
  //   submission.mark = createdMark;
  //   submission.status = SubmissionStatus.REVIEWED;
  //   submission.reviewComment = comment;
  //   await this.submissionRepository.save(submission);
  //   return submission;
  // }

  async delete(id: number) {
    const submission = await this.getById(id);
    await this.submissionRepository.remove(submission);
    return { message: `Submission with id ${id} was deleted successfully` };
  }
}

export const submissionService = new SubmissionService();
