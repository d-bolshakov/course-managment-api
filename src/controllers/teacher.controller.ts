import { teacherService } from "../services/teacher.service";
import { NextFunction, Request, Response } from "express";

class TeacherController {
  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await teacherService.create(body, user!);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await teacherService.getById(Number(req.params.id), {
        relations: { subjects: true, user: true },
        select: {
          id: true,
          subjects: {
            id: true,
            title: true,
          },
          user: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getCoursesByTeacher(
    { params: { id } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await teacherService.getCoursesByTeacher(Number(id));
      res.status(201).json(response);
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
      const response = await teacherService.getMany({
        filters: filters as any,
        relations: {
          subjects: true,
          user: true,
        },
        select: {
          id: true,
          subjects: {
            id: true,
            title: true,
          },
          user: {
            firstName: true,
            lastName: true,
          },
        },
        page: Number(page),
      });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { params: { id }, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await teacherService.update(Number(id), body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete({ params: { id } }: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json(await teacherService.delete(Number(id)));
    } catch (e) {
      next(e);
    }
  }
}
export const teacherController = new TeacherController();
