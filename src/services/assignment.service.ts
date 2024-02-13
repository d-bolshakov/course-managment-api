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

@injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @inject("assignment-repository")
    private assignmentRepository: IAssignmentRepository,
    @inject("course-repository") private courseRepository: ICourseRepository,
    @inject("assignment-attachment-service")
    private attachmentService: IAttachmentService
  ) {}

  async create(
    dto: CreateAssignmentDto,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    console.log(attachment);
    if (!(await this.courseRepository.isActive(dto.courseId)))
      throw createError.BadRequest(
        `Creating assignments for the course with id ${dto.courseId} is not available`
      );
    const saved = await this.assignmentRepository.create(dto);
    let savedAttachments;
    if (attachment)
      savedAttachments = await this.attachmentService.create(
        saved.id,
        attachment
      );
    return plainToInstance(
      AssignmentDto,
      { ...saved, attachments: savedAttachments },
      {
        exposeUnsetFields: false,
      }
    );
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

  async getFullDataById(id: number) {
    const assignment = await this.assignmentRepository.getFullDataById(id);
    if (!assignment)
      throw createError.NotFound(`Assignment with id ${id} does not exist`);
    return plainToInstance(AssignmentDto, assignment, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: UpdateAssignmentDto) {
    const assignment = await this.assignmentRepository.getById(id);
    if (!assignment)
      throw createError.NotFound(`Assignment with id ${id} does not exist`);
    if (assignment.deadline < new Date())
      throw createError.BadRequest(`Could not update inactive assignment`);
    const { success: isUpdated } = await this.assignmentRepository.updateById(
      id,
      dto
    );
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during deleteding assignment with id ${id}`
      );
    return this.assignmentRepository.getById(id);
  }

  async delete(id: number) {
    const assignment = await this.assignmentRepository.existsWithId(id);
    if (!assignment)
      throw createError.NotFound(`Assignment with id ${id} does not exist`);
    const { success: isDeleted } = await this.assignmentRepository.deleteById(
      id
    );
    if (!isDeleted)
      throw createError.InternalServerError(
        `Something went wrong during deleteding assignment with id ${id}`
      );
    return { message: `Assignment with id ${id} was deleted successfully` };
  }
}
