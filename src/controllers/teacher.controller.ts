import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ITeacherService } from "../interfaces/services/teacher-service.interface.js";
import type { ICourseService } from "../interfaces/services/course-service.interface.js";
import type { IAssignmentService } from "../interfaces/services/assignment-service.interface.js";
import type { ISubmissionService } from "../interfaces/services/submission-service.interface.js";

@injectable()
export class TeacherController {
  constructor(
    @inject("teacher-service") private teacherService: ITeacherService,
    @inject("course-service") private courseService: ICourseService,
    @inject("assignment-service") private assignmentService: IAssignmentService,
    @inject("submission-service") private submissionService: ISubmissionService
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.teacherService.create({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.teacherService.getById(
        Number(req.params.teacherId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getCoursesOfTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.courseService.getCoursesOfTeacher(
        Number(req.params.teacherId),
        { filters: req.query as any }
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getAssignmentsOfTeacher(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.assignmentService.getAssignmentsOfTeacher(
        Number(req.params.teacherId),
        { filters: req.query as any }
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getSubmissionsOfTeacher(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.submissionService.getSubmissionsOfTeacher(
        Number(req.params.teacherId),
        { filters: req.query as any }
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.teacherService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { params: { teacherId }, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.teacherService.update(
        Number(teacherId),
        body
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { teacherId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(this.teacherService.delete(Number(teacherId)));
    } catch (e) {
      next(e);
    }
  }
}
