import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ISubmissionService } from "../interfaces/services/submission-service.interface";

@injectable()
export class SubmissionController {
  constructor(
    @inject("submission-service")
    private submissionService: ISubmissionService
  ) {}
  async create(
    // @ts-ignore
    { body, user, files: { attachment } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.submissionService.create(
        user?.studentProfile.id!,
        body,
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
      const response = await this.submissionService.getFullDataById(
        Number(submissionId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.submissionService.getMany({
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
      const response = await this.submissionService.getMany({
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
      const response = await this.submissionService.review(
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
      res.status(201).json(this.submissionService.delete(Number(submissionId)));
    } catch (e) {
      next(e);
    }
  }
}
