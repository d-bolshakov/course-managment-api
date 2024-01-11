import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Assignment, AssignmentAttachment, File, User } from "../entities";
import { courseService, fileService } from ".";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThan,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";
import { AssignmentDto } from "../dto";
import { AssignmentFilterDto, AssignmentFilterStatus } from "../dto/filters";
import { UploadedFile } from "express-fileupload";
import { attachmentService } from ".";

class AssignmentService {
  private assignmentRepository = AppDataSource.getRepository(Assignment);

  async create(
    courseId: number,
    dto: AssignmentDto,
    user: User,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    const { title, text, deadline } = dto;
    const candidateCourse = await courseService.getById(courseId);
    if (
      candidateCourse.startsAt > new Date() ||
      candidateCourse.endsAt < new Date()
    )
      throw new BadRequest(
        `Creating assignments for the course with id ${candidateCourse.id} is not available`
      );
    const assignment = new Assignment();
    assignment.course = candidateCourse;
    assignment.title = title;
    assignment.text = text;
    assignment.deadline = deadline;
    const saved = await this.assignmentRepository.save(assignment);
    if (attachment)
      assignment.attachments = await attachmentService.createForAssignment(
        saved,
        attachment
      );
    return assignment;
  }

  async getOne(
    conditions: FindOptionsWhere<Assignment>,
    options?: {
      relations?: FindOptionsRelations<Assignment>;
      select?: FindOptionsSelect<Assignment>;
    }
  ) {
    return this.assignmentRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options: {
    filters: AssignmentFilterDto;
    relations?: FindOptionsRelations<Assignment>;
    select?: FindOptionsSelect<Assignment>;
    page?: number;
  }) {
    const conditions: FindOptionsWhere<Assignment> = {};
    const { courseId, status } = options?.filters;
    if (courseId) conditions.course = { id: courseId };
    if (status) {
      if (status === AssignmentFilterStatus.ACTIVE)
        conditions.deadline = MoreThan(new Date());
      else if (status === AssignmentFilterStatus.INACTIVE)
        conditions.deadline = LessThanOrEqual(new Date());
    }
    const findOptions: FindManyOptions<Assignment> = {
      where: conditions,
      relations: options?.relations,
      select: options.select,
    };
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);

    return this.assignmentRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Assignment>;
      select?: FindOptionsSelect<Assignment>;
    }
  ) {
    const assignment = await this.getOne({ id }, options);
    if (!assignment)
      throw new BadRequest(`Assignment with id ${id} does not exist`);
    return assignment;
  }

  async update(id: number, dto: AssignmentDto) {
    const { deadline, text, title } = dto;
    const assignment = await this.getById(id);
    if (assignment.deadline! < new Date())
      throw new BadRequest(`Could not update assignment`);
    assignment.deadline = deadline;
    assignment.text = text;
    assignment.title = title;
    return this.assignmentRepository.save(assignment);
  }

  async delete(id: number) {
    const assignment = await this.getById(id);
    await this.assignmentRepository.remove(assignment);
    return { message: `Assignment with id ${id} was deleted successfully` };
  }
}

export const assignmentService = new AssignmentService();
