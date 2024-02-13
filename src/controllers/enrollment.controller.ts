import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IEnrollmentService } from "../interfaces/services/enrollment-service.interface";

@injectable()
export class EnrollmentController {
  constructor(
    @inject("enrollment-service") private enrollmentService: IEnrollmentService
  ) {}
  async create(
    { user, params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.enrollmentService.create(
        Number(courseId),
        user?.studentProfile.id!
      );
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
      const response = await this.enrollmentService.getById(
        Number(enrollmentId)
      );
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.enrollmentService.getMany({
        filters: query as any,
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getEnrollmentsByCourse(
    { query, params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.enrollmentService.getMany({
        filters: {
          ...query,
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
      const response = await this.enrollmentService.update(
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
      res.status(201).json(this.enrollmentService.delete(Number(enrollmentId)));
    } catch (e) {
      next(e);
    }
  }
}
