import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { Assignment } from "../entities/Assignment.entity.js";
import { courseService } from "./course.service.js";
import { FindOptionsWhere, LessThanOrEqual, MoreThan, Not } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";

import { UploadedFile } from "express-fileupload";
import { attachmentService } from "./attachment.service.js";
import { plainToInstance } from "class-transformer";
import { AssignmentDto } from "../dto/assignment/assignment.dto.js";
import { CreateAssignmentDto } from "../dto/assignment/create-assignment.dto.js";
import {
  FilterAssignmentDto,
  FilterAssignmentStatus,
} from "../dto/assignment/filter-assignment.dto.js";
import {
  FilterStudentAssignmentDto,
  FilterStudentAssignmentCompletion,
} from "../dto/assignment/filter-student-assignment.dto.js";
import { UpdateAssignmentDto } from "../dto/assignment/update-assignment.dto.js";

class AssignmentService {
  private assignmentRepository = AppDataSource.getRepository(Assignment);

  async create(
    dto: CreateAssignmentDto,
    attachment?: UploadedFile | UploadedFile[]
  ) {
    const { title, text, deadline, courseId } = dto;
    if (!(await courseService.isActive(courseId)))
      throw new createError.BadRequest(
        `Creating assignments for the course with id ${courseId} is not available`
      );
    const assignment = this.assignmentRepository.create({
      courseId,
      title,
      text,
      deadline,
    });
    const saved = await this.assignmentRepository.save(assignment);
    let savedAttachments;
    if (attachment)
      savedAttachments = await attachmentService.createForAssignment(
        saved.id,
        attachment
      );
    return plainToInstance(
      AssignmentDto,
      { ...assignment, attachments: savedAttachments },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async getMany(options: { filters: FilterAssignmentDto }) {
    const conditions: FindOptionsWhere<Assignment> = {};
    const { courseId, status } = options?.filters;
    if (courseId) conditions.course = { id: courseId };
    if (status) {
      if (status === FilterAssignmentStatus.ACTIVE)
        conditions.deadline = MoreThan(new Date());
      else if (status === FilterAssignmentStatus.INACTIVE)
        conditions.deadline = LessThanOrEqual(new Date());
    }
    const assignments = await this.assignmentRepository.find({
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
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(AssignmentDto, assignments, {
      exposeUnsetFields: false,
    });
  }

  async getAssignmentsOfTeacher(
    teacherId: number,
    options?: {
      filters: FilterAssignmentDto;
    }
  ) {
    const conditions: FindOptionsWhere<Assignment> = { course: { teacherId } };
    if (options?.filters.courseId)
      conditions.courseId = options.filters.courseId;
    if (options?.filters.status) {
      if (options.filters.status === FilterAssignmentStatus.ACTIVE)
        conditions.deadline = MoreThan(new Date());
      else if (options.filters.status === FilterAssignmentStatus.INACTIVE)
        conditions.deadline = LessThanOrEqual(new Date());
    }
    const assignments = await this.assignmentRepository.find({
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
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(AssignmentDto, assignments, {
      exposeUnsetFields: false,
    });
  }

  async getAssignmentsOfStudent(
    studentId: number,
    options?: {
      filters: FilterStudentAssignmentDto;
    }
  ) {
    const conditions: FindOptionsWhere<Assignment> = {
      course: { enrollments: { studentId } },
    };
    if (options?.filters.courseId)
      conditions.courseId = options.filters.courseId;
    if (options?.filters.status) {
      if (options.filters.status === FilterAssignmentStatus.ACTIVE)
        conditions.deadline = MoreThan(new Date());
      else if (options.filters.status === FilterAssignmentStatus.INACTIVE)
        conditions.deadline = LessThanOrEqual(new Date());
    }
    if (options?.filters.completion) {
      if (
        options.filters.completion ===
        FilterStudentAssignmentCompletion.COMPLETE
      )
        conditions.submissions = { studentId };
      else if (
        options.filters.completion ===
        FilterStudentAssignmentCompletion.INCOMPLETE
      )
        conditions.submissions = { studentId: Not(studentId) };
    }
    const assignments = await this.assignmentRepository.find({
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
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(AssignmentDto, assignments, {
      exposeUnsetFields: false,
    });
  }

  async getFullDataById(id: number) {
    const assignment = await this.assignmentRepository.findOne({
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
    if (!assignment)
      throw new createError.BadRequest(
        `Assignment with id ${id} does not exist`
      );
    return plainToInstance(AssignmentDto, assignment, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: UpdateAssignmentDto) {
    const { deadline, text, title } = dto;
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
    });
    if (!assignment)
      throw new createError.NotFound(`Assignment with id ${id} does not exist`);
    if (assignment.deadline! < new Date())
      throw new createError.BadRequest(`Could not update inactive assignment`);
    assignment.deadline = deadline;
    assignment.text = text;
    assignment.title = title;
    await this.assignmentRepository.save(assignment);
    return plainToInstance(AssignmentDto, assignment, {
      exposeUnsetFields: false,
    });
  }

  async delete(id: number) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
    });
    if (!assignment)
      throw new createError.NotFound(`Assignment with id ${id} does not exist`);
    await this.assignmentRepository.remove(assignment);
    return { message: `Assignment with id ${id} was deleted successfully` };
  }

  async isActive(id: number) {
    return this.assignmentRepository
      .createQueryBuilder("a")
      .where("a.id = :id", { id })
      .andWhere("a.deadline > CURRENT_TIMESTAMP")
      .getExists();
  }
}

export const assignmentService = new AssignmentService();
