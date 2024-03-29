import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IStudentService } from "../core/services/interfaces/student-service.interface";
import type { ICourseService } from "../core/services/interfaces/course-service.interface";
import type { ISubmissionService } from "../core/services/interfaces/submission-service.interface";
import type { IAssignmentService } from "../core/services/interfaces/assignment-service.interface";

@injectable()
export class StudentController {
  constructor(
    @inject("student-service") private studentService: IStudentService,
    @inject("course-service") private courseService: ICourseService,
    @inject("assignment-service") private assignmentService: IAssignmentService,
    @inject("submission-service") private submissionService: ISubmissionService
  ) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.studentService.create(req.user!.id);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.studentService.getById(
        Number(req.params.studentId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getCoursesOfStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.courseService.getCoursesOfStudent(
        Number(req.params.studentId),
        { filters: req.query as any }
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getAssignmentsOfStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.assignmentService.getAssignmentsOfStudent(
        Number(req.params.studentId),
        { filters: req.query as any }
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getSubmissionsOfStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.submissionService.getSubmissionsOfStudent(
        Number(req.params.studentId),
        { filters: req.query as any }
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.studentService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { studentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(await this.studentService.delete(Number(studentId)));
    } catch (e) {
      next(e);
    }
  }
}
