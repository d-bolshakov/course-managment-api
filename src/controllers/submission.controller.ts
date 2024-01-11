import { submissionService } from "../services";
import { NextFunction, Request, Response } from "express";

class SubmissionController {
  async create(
    // @ts-ignore
    { body, user, params: { assignmentId }, files: { attachment } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.create(
        Number(assignmentId),
        body,
        user!,
        attachment
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(
    { params: { submissionId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.getById(Number(submissionId), {
        relations: { attachments: true, mark: true },
        select: {
          id: true,
          text: true,
          comment: true,
          createdAt: true,
          mark: {
            id: true,
            mark: true,
          },
          assignmentId: true,
          status: true,
          reviewComment: true,
          attachments: {
            id: true,
            fileId: true,
          },
        },
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany(
    { query: { page, ...filters } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.getMany({
        page: Number(page),
        filters: filters as any,
        select: {
          id: true,
          status: true,
          assignmentId: true,
          studentId: true,
          createdAt: true,
        },
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getSubmissionsByAssignment(
    { query: { page, ...filters }, params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.getMany({
        page: Number(page),
        filters: {
          ...filters,
          assignmentId: Number(assignmentId),
        } as any,
        select: {
          id: true,
          status: true,
          studentId: true,
          createdAt: true,
        },
      });

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async review(
    { params: { submissionId }, user, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.review(
        Number(submissionId),
        body,
        user!
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { submissionId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(submissionService.delete(Number(submissionId)));
    } catch (e) {
      next(e);
    }
  }
}
export const submissionController = new SubmissionController();
