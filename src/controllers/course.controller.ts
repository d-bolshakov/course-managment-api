import { courseService } from "../services";
import { NextFunction, Request, Response } from "express";

class CourseController {
  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.create(body, user!);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(
    { params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await courseService.getById(Number(courseId));
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
      const response = await courseService.getMany({
        filters: filters as any,
        page: Number(page),
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { body, params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await courseService.update(Number(courseId), body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(courseService.delete(Number(courseId)));
    } catch (e) {
      next(e);
    }
  }
}
export const courseController = new CourseController();
