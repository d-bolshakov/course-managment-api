import { Router } from "express";
import { teacherController } from "../controllers/";
import {
  DtoValidationMiddleware,
  AuthMiddleware,
  IdValidationMiddleware,
} from "../middleware/";
import { TeacherDto, UpdateTeacherDto } from "../dto/";
import { FilterTeacherDto } from "../dto/";

export const TeacherRouter = Router();

TeacherRouter.post(
  "/",
  AuthMiddleware,
  DtoValidationMiddleware(TeacherDto, "body"),
  teacherController.create
);
TeacherRouter.get(
  "/",
  DtoValidationMiddleware(FilterTeacherDto, "query"),
  teacherController.getMany
);
TeacherRouter.get("/:id", IdValidationMiddleware(), teacherController.getOne);
TeacherRouter.get(
  "/:id/courses",
  IdValidationMiddleware(),
  teacherController.getCoursesByTeacher
);
TeacherRouter.patch(
  "/:id",
  IdValidationMiddleware(),
  AuthMiddleware,
  DtoValidationMiddleware(UpdateTeacherDto, "body"),
  teacherController.update
);
TeacherRouter.delete(
  "/:id",
  IdValidationMiddleware(),
  AuthMiddleware,
  teacherController.delete
);
