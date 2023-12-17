import { teacherService } from "../services/teacher.service";
import { NextFunction, Request, Response } from "express";
import { TeacherDto, CourseDto, BaseDtoGroups } from "../dto/";
import { plainToInstance } from "class-transformer";

class TeacherController {
  async create({ body, user }: Request, res: Response, next: NextFunction) {
    try {
      const response = await teacherService.create(body, user!);
      res.status(201).json(
        plainToInstance(TeacherDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
    } catch (e) {
      next(e);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await teacherService.getById(Number(req.params.id), {
        relations: { subjects: true, user: true },
      });
      res.status(200).json(
        plainToInstance(TeacherDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
      res.status(201).json(
        plainToInstance(CourseDto, response, {
          groups: [BaseDtoGroups.RESPONSE_PARTIAL],
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
      let response;
      if (Object.keys(filters).length)
        response = await teacherService.getManyFiltered({
          filters,
          page: Number(page),
          relations: {
            subjects: true,
            user: true,
          },
        });
      else
        response = await teacherService.getMany({
          page: Number(page),
          relations: {
            subjects: true,
            user: true,
          },
        });
      res.status(200).json(
        plainToInstance(TeacherDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
      res.status(201).json(
        plainToInstance(TeacherDto, response, {
          groups: [BaseDtoGroups.RESPONSE_FULL],
        })
      );
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
