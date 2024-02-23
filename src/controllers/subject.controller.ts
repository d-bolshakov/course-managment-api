import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ISubjectService } from "../core/services/interfaces/subject-service.interface";

@injectable()
export class SubjectController {
  constructor(
    @inject("subject-service") private subjectService: ISubjectService
  ) {}

  async create({ body }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.subjectService.create(body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.subjectService.getById(Number(id));
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.subjectService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { body, params: { id } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.subjectService.update(Number(id), body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await this.subjectService.delete(Number(id)));
    } catch (e) {
      next(e);
    }
  }
}
