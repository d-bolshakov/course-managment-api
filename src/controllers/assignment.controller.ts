import { assignmentService } from "../services/assignment.service.js";
import { NextFunction, Request, Response } from "express";

class AssignmentController {
  async create(
    // @ts-ignore

    { body, files: { attachment } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.create(body, attachment as any);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(
    { params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.getFullDataById(
        Number(assignmentId)
      );
      console.log(response);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await assignmentService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getAssignmentsByCourse(
    { query, query: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.getMany({
        filters: {
          ...query,
          courseId,
        } as any,
      });

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { body, params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.update(
        Number(assignmentId),
        body
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(assignmentService.delete(Number(assignmentId)));
    } catch (e) {
      next(e);
    }
  }
}
export const assignmentController = new AssignmentController();
