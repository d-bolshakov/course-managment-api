import type { UploadedFile } from "express-fileupload";
import { CreateSubmissionDto } from "../../dto/submission/create-submission.dto";
import { SubmissionDto } from "../../dto/submission/submission.dto";
import { FilterSubmissionDto } from "../../dto/submission/filter-submission.dto";
import { ReviewSubmissionDto } from "../../dto/submission/review-submission.dto";
import { ReviewDto } from "../../dto/review/review.dto";

export interface ISubmissionService {
  create(
    studentId: number,
    dto: CreateSubmissionDto,
    attachment?: UploadedFile | UploadedFile[]
  ): Promise<SubmissionDto>;

  getMany(options: { filters: FilterSubmissionDto }): Promise<SubmissionDto[]>;

  getSubmissionsOfTeacher(
    teacherId: number,
    options?: { filters: FilterSubmissionDto }
  ): Promise<SubmissionDto[]>;

  getSubmissionsOfStudent(
    studentId: number,
    options?: { filters: FilterSubmissionDto }
  ): Promise<SubmissionDto[]>;

  getFullDataById(id: number): Promise<SubmissionDto>;

  review(id: number, dto: ReviewSubmissionDto): Promise<ReviewDto>;

  delete(id: number): Promise<{ message: string }>;
}
