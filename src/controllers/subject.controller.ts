import { subjectService } from "../services/";
import { NextFunction, Request, Response } from "express";
import { SubjectDto, BaseDtoGroups } from "../dto/";
import { plainToInstance } from "class-transformer";

class SubjectController {
  async create({ body }: Request, res: Response, next: NextFunction) {
    try {
      const response = await subjectService.create(body);
      res.status(201).json(
        plainToInstance(SubjectDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
    } catch (e) {
      next(e);
    }
  }

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      const response = await subjectService.getById(Number(id));
      res.status(200).json(
        plainToInstance(SubjectDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
    } catch (e) {
      next(e);
    }
  }

  async getMany(
    { query: { page } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await subjectService.getMany({
        page: Number(page),
      });
      res.status(200).json(
        plainToInstance(SubjectDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
      res.status(201).json(
        plainToInstance(SubjectDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
