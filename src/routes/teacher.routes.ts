import { Router } from "express";
import { teacherController } from "../controllers/";
import {
  DtoValidationMiddleware,
  AuthMiddleware,
  IdValidationMiddleware,
} from "../middleware/";
import { TeacherDto, TeacherFilterDto, BaseDtoGroups } from "../dto/";

export const TeacherRouter = Router();

TeacherRouter.post(
  "/",
  AuthMiddleware,
  DtoValidationMiddleware(TeacherDto, "body", {
    groups: [BaseDtoGroups.CREATE],
  }),
  teacherController.create
);
TeacherRouter.get(
  "/",
  DtoValidationMiddleware(TeacherFilterDto, "query"),
  teacherController.getMany
);
TeacherRouter.get("/:id", teacherController.getOne);
TeacherRouter.get("/:id/courses", teacherController.getCoursesByTeacher);
TeacherRouter.patch(
  "/:id",
  IdValidationMiddleware,
  AuthMiddleware,
  DtoValidationMiddleware(TeacherDto, "body", {
    groups: [BaseDtoGroups.UPDATE],
  }),
  teacherController.update
);
TeacherRouter.delete(
  "/:id",
  IdValidationMiddleware,
  AuthMiddleware,
  teacherController.delete
);
