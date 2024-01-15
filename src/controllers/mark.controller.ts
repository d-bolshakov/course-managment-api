import { markService } from "../services";
import { NextFunction, Request, Response } from "express";

class MarkController {
  async getMarksByCourse(
    { query: { page, ...filters }, params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await markService.getMany({
        page: Number(page),
        filters: {
          ...filters,
          courseId: Number(courseId),
        } as any,
        relations: {
          review: { submission: true },
        },
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
  async getMarksByAssignment(
    { query: { page, ...filters }, params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await markService.getMany({
        page: Number(page),
        filters: {
          ...filters,
          assignmentId: Number(assignmentId),
        } as any,
        relations: {
          review: { submission: true },
        },
        select: {
          id: true,
          mark: true,
          createdAt: true,
          review: {
            submission: {
              id: true,
            },
          },
        },
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
  async getMarksBySubmission(
    { query: { page, ...filters }, params: { submissionId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await markService.getMany({
        page: Number(page),
        filters: {
          ...filters,
          submissionId: Number(submissionId),
        } as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}
export const markController = new MarkController();
