import { submissionService } from "../services/submission.service.js";
import { NextFunction, Request, Response } from "express";

class SubmissionController {
  async create(
    // @ts-ignore
    { body, user, files: { attachment } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(user);
      const response = await submissionService.create(
        body,
        user?.studentProfile.id!,
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
      const response = await submissionService.getFullDataById(
        Number(submissionId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await submissionService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getSubmissionsByAssignment(
    { query }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.getMany({
        filters: query as any,
      });

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async review(
    { params: { submissionId }, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await submissionService.review(
        Number(submissionId),
        body
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
