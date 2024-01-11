import { assignmentService } from "../services";
import { NextFunction, Request, Response } from "express";

class AssignmentController {
  async create(
    // @ts-ignore

    { body, user, params: { courseId }, files: { attachment } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.create(
        Number(courseId),
        body,
        user!,
        attachment as any
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(
    { params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.getById(Number(assignmentId), {
        relations: { attachments: true },
        select: {
          id: true,
          title: true,
          text: true,
          deadline: true,
          createdAt: true,
          attachments: {
            id: true,
            fileId: true,
          },
        },
      });
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
      const response = await assignmentService.getMany({
        page: Number(page),
        filters: filters as any,
        select: {
          id: true,
          createdAt: true,
          courseId: true,
          title: true,
          deadline: true,
        },
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getAssignmentsByCourse(
    { query: { page, ...filters }, params: { courseId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.getMany({
        page: Number(page),
        filters: {
          ...filters,
          courseId: Number(courseId),
        } as any,
        select: {
          id: true,
          createdAt: true,
          title: true,
          deadline: true,
        },
      });

      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { body, params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await assignmentService.update(
        Number(assignmentId),
        body
      );
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { assignmentId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(assignmentService.delete(Number(assignmentId)));
    } catch (e) {
      next(e);
    }
  }
}
export const assignmentController = new AssignmentController();
