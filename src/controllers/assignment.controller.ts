import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IAssignmentService } from "../core/services/interfaces/assignment-service.interface";

@injectable()
export class AssignmentController {
  constructor(
    @inject("assignment-service") private assignmentService: IAssignmentService
  ) {}

  async create({ body, files }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.assignmentService.create(
        body,
        files?.attachment
      );
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
      const response = await this.assignmentService.getById(
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
      const response = await this.assignmentService.getMany({
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
      const response = await this.assignmentService.getMany({
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
    { body, params: { assignmentId }, files }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.assignmentService.update(
        Number(assignmentId),
        body,
        files?.attachment
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
      res
        .status(201)
        .json(await this.assignmentService.delete(Number(assignmentId)));
    } catch (e) {
      next(e);
    }
  }
}
