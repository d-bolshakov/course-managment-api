import createError from "http-errors";
import type { UploadedFile } from "express-fileupload";
import { plainToInstance } from "class-transformer";
import { AssignmentDto } from "../dto/assignment/assignment.dto.js";
import { CreateAssignmentDto } from "../dto/assignment/create-assignment.dto.js";
import { FilterStudentAssignmentDto } from "../dto/assignment/filter-student-assignment.dto.js";
import { UpdateAssignmentDto } from "../dto/assignment/update-assignment.dto.js";
import type { IAssignmentService } from "../interfaces/services/assignment-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { IAssignmentRepository } from "../interfaces/repositories/assignment-repository.interface.js";
import type { ICourseRepository } from "../interfaces/repositories/course-repository.interface.js";
import type { IAttachmentService } from "../interfaces/services/attachment-service.interface.js";
import type { FilterBaseAssignmentDto } from "../dto/assignment/filter-base-assignment.dto.js";
import type { UpdateAssignmentRequestBodyDto } from "../dto/assignment/update-assignment-request-body.dto.js";
import type { ISubmissionRepository } from "../interfaces/repositories/submission-repository.interface.js";

@injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @inject("assignment-repository")
    private assignmentRepository: IAssignmentRepository,
    @inject("course-repository") private courseRepository: ICourseRepository,
    @inject("submission-repository")
    private submissionRepository: ISubmissionRepository,
    @inject("assignment-attachment-service")
    private attachmentService: IAttachmentService
  ) {}

  async create(
    dto: CreateAssignmentDto,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    if (!(await this.courseRepository.isActive(dto.courseId)))
      throw createError.BadRequest(
        `Creating assignments for the course with id ${dto.courseId} is not available`
      );
    const saved = await this.assignmentRepository.create(dto);
    if (attachment) await this.attachmentService.create(saved.id, attachment);
    return this.getById(saved.id);
  }

  async getMany(options: { filters: FilterBaseAssignmentDto }) {
    return this.assignmentRepository.getMany(options.filters);
  }

  async getAssignmentsOfTeacher(
    teacherId: number,
    options?: {
      filters: FilterBaseAssignmentDto;
    }
  ) {
    return this.assignmentRepository.getMany({
      ...options?.filters,
      teacherId,
    });
  }

  async getAssignmentsOfStudent(
    studentId: number,
    options?: {
      filters: FilterStudentAssignmentDto;
    }
  ) {
    return this.assignmentRepository.getMany({
      ...options?.filters,
      studentId,
    });
  }

  async getById(id: number) {
    const assignment = await this.assignmentRepository.getById(id);
    if (!assignment)
      throw createError.NotFound(`Assignment with id ${id} does not exist`);
    return assignment;
  }

  async update(
    id: number,
    dto: UpdateAssignmentRequestBodyDto,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    const assignment = await this.assignmentRepository.getById(id);
    if (!assignment)
      throw createError.NotFound(`Assignment with id ${id} does not exist`);
    if (assignment.deadline < new Date())
      throw createError.BadRequest(`Could not update inactive assignment`);
    if (await this.submissionRepository.countSubmissionsForAssignment(id))
      throw createError.BadRequest(
        "Could not update an assignment that already has any submissions"
      );
    this.attachmentService.update(id, {
      deletedIds: dto.deletedAttachmentIds,
      new: attachment,
    });
    const updateDto = plainToInstance(UpdateAssignmentDto, dto, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
    // check if dto has any defined properties to update
    if (Object.values(updateDto).some((v) => v)) {
      const { success: isUpdated } = await this.assignmentRepository.updateById(
        id,
        updateDto
      );
      if (!isUpdated)
        throw createError.InternalServerError(
          `Something went wrong during updating assignment with id ${id}`
        );
    }
    return this.assignmentRepository.getById(id);
  }

  async delete(id: number) {
    const assignment = await this.assignmentRepository.existsWithId(id);
    if (!assignment)
      throw createError.NotFound(`Assignment with id ${id} does not exist`);
    const result = await this.assignmentRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleteding assignment with id ${id}`
      );
    return result;
  }
}
