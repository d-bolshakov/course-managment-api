import { inject, injectable } from "tsyringe";
import type { NextFunction, Request, Response } from "express";
import type { ICourseService } from "../interfaces/services/course-service.interface";

@injectable()
export class CourseController {
  constructor(
    @inject("course-service") private courseService: ICourseService
  ) {}

  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.courseService.create(
        user?.teacherProfile.id!,
        body
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
      const response = await this.courseService.getFullDataById(
        Number(courseId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.courseService.getMany({
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
      const response = await this.courseService.update(Number(courseId), body);
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
      res.status(201).json(this.courseService.delete(Number(courseId)));
    } catch (e) {
      next(e);
    }
  }
}
