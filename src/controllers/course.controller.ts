import { inject, injectable } from "tsyringe";
import type { NextFunction, Request, Response } from "express";
import type { ICourseService } from "../core/services/interfaces/course-service.interface";
import type { FilterBaseCourseDto } from "../dto/course/filter-base-course.dto";

@injectable()
export class CourseController {
  constructor(
    @inject("course-service") private courseService: ICourseService
  ) {}

  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.courseService.create(
        // @ts-expect-error
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
      const response = await this.courseService.getById(Number(courseId));
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.courseService.getMany({
        filters: query as FilterBaseCourseDto,
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
      res.status(201).json(await this.courseService.delete(Number(courseId)));
    } catch (e) {
      next(e);
    }
  }
}
