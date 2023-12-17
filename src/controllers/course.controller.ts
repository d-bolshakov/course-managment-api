import { plainToInstance } from "class-transformer";
import { courseService } from "../services";
import { NextFunction, Request, Response } from "express";
import { CourseDto, BaseDtoGroups } from "../dto/";

class CourseController {
  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.create(body, user!);
      res.status(201).json(
        plainToInstance(CourseDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
    } catch (e) {
      next(e);
    }
  }

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.getById(Number(id));
      res.status(200).json(
        plainToInstance(CourseDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
      const options = {
        page: Number(page),
        relations: { subject: true, teacher: true },
      };
      let response;
      if (Object.keys(filters).length)
        response = await courseService.getManyFiltered({
          ...options,
          filters,
        });
      else response = await courseService.getMany(options);
      res.status(200).json(
        plainToInstance(CourseDto, response, {
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
      const response = await courseService.update(Number(id), body);
      res.status(201).json(
        plainToInstance(CourseDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
    } catch (e) {
      next(e);
    }
  }

  async delete({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(courseService.delete(Number(id)));
    } catch (e) {
      next(e);
    }
  }
}
export const courseController = new CourseController();
