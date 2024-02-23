import type { UploadedFile } from "express-fileupload";
import { CreateSubmissionDto } from "../../../dto/submission/create-submission.dto.js";
import { SubmissionDto } from "../../../dto/submission/submission.dto.js";
import { FilterSubmissionDto } from "../../../dto/submission/filter-submission.dto.js";
import { ReviewSubmissionDto } from "../../../dto/submission/review-submission.dto.js";
import { ReviewDto } from "../../../dto/review/review.dto.js";
import type { FilterBaseSubmissionDto } from "../../../dto/submission/filter-base-submission.dto.js";
import type { UpdateSubmissionRequestBodyDto } from "../../../dto/submission/update-submission-request-body.dto.js";

export interface ISubmissionService {
  create(
    studentId: number,
    dto: CreateSubmissionDto,
    attachment?: UploadedFile | UploadedFile[]
  ): Promise<SubmissionDto>;

  getMany(options: {
    filters: FilterSubmissionDto;
  }): Promise<{ submissions: SubmissionDto[]; count: number }>;

  getSubmissionsOfTeacher(
    teacherId: number,
    options?: { filters: FilterBaseSubmissionDto }
  ): Promise<{ submissions: SubmissionDto[]; count: number }>;

  getSubmissionsOfStudent(
    studentId: number,
    options?: { filters: FilterBaseSubmissionDto }
  ): Promise<{ submissions: SubmissionDto[]; count: number }>;

  getById(id: number): Promise<SubmissionDto>;

  review(id: number, dto: ReviewSubmissionDto): Promise<ReviewDto>;

  update(
    id: number,
    dto: UpdateSubmissionRequestBodyDto,
    attachment?: UploadedFile | UploadedFile[]
  ): Promise<SubmissionDto | null>;

  delete(id: number): Promise<{ success: boolean }>;
}
