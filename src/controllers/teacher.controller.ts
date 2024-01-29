import { courseService } from "../services/course.service.js";
import { teacherService } from "../services/teacher.service.js";
import { NextFunction, Request, Response } from "express";
import { assignmentService } from "../services/assignment.service.js";
import { submissionService } from "../services/submission.service.js";

class TeacherController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await teacherService.getFullDataById(
        Number(req.params.teacherId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getCoursesOfTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.getCoursesOfTeacher(
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
      const response = await assignmentService.getAssignmentsOfTeacher(
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
      const response = await submissionService.getSubmissionsOfTeacher(
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
      const response = await teacherService.getMany({
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
      const response = await teacherService.update(Number(teacherId), body);
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
      res.status(201).json(await teacherService.delete(Number(teacherId)));
    } catch (e) {
      next(e);
    }
  }
}
export const teacherController = new TeacherController();
