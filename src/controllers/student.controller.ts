import { NextFunction, Request, Response } from "express";
import { assignmentService } from "../services/assignment.service.js";
import { courseService } from "../services/course.service.js";
import { studentService } from "../services/student.service.js";
import { submissionService } from "../services/submission.service.js";

class StudentController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await studentService.getFullDataById(
        Number(req.params.studentId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getCoursesOfStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.getCoursesOfStudent(
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
      const response = await assignmentService.getAssignmentsOfStudent(
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
      const response = await submissionService.getSubmissionsOfStudent(
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
      const response = await studentService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { params: { studentId }, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await studentService.update(Number(studentId), body);
      res.status(201).json(response);
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
      res.status(201).json(await studentService.delete(Number(studentId)));
    } catch (e) {
      next(e);
    }
  }
}
export const studentController = new StudentController();
