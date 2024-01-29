import { subjectService } from "../services/subject.service.js";
import { NextFunction, Request, Response } from "express";

class SubjectController {
  async create({ body }: Request, res: Response, next: NextFunction) {
    try {
      const response = await subjectService.create(body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      const response = await subjectService.getById(Number(id));
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await subjectService.getMany({
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
      const response = await subjectService.update(Number(id), body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await subjectService.delete(Number(id)));
    } catch (e) {
      next(e);
    }
  }
}
export const subjectController = new SubjectController();
