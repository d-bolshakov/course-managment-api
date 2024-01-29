import { courseService } from "../services/course.service.js";
import { NextFunction, Request, Response } from "express";

class CourseController {
  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.create(
        body,
        user?.teacherProfile.id!
      );
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
      const response = await courseService.getFullDataById(Number(courseId));
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await courseService.getMany({
        filters: query as any,
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
