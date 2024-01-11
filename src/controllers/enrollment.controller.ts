import { enrollmentService } from "../services";
import { NextFunction, Request, Response } from "express";

class EnrollmentController {
  async create(
    { user, params: { id } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await enrollmentService.create(Number(id), user!);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(
    { params: { enrollmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await enrollmentService.getById(Number(enrollmentId));
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
      const response = await enrollmentService.getMany({
        filters: filters as any,
        page: Number(page),
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getEnrollmentsByCourse(
    { query: { page, ...filters }, params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await enrollmentService.getMany({
        page: Number(page),
        filters: {
          courseId: Number(courseId),
        } as any,
      });

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { body, params: { enrollmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await enrollmentService.update(
        Number(enrollmentId),
        body
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { enrollmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(enrollmentService.delete(Number(enrollmentId)));
    } catch (e) {
      next(e);
    }
  }
}
export const enrollmentController = new EnrollmentController();
