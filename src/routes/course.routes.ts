import { Router } from "express";
import { courseController } from "../controllers/";
import {
  AuthMiddleware,
  DtoValidationMiddleware,
  IdValidationMiddleware,
} from "../middleware/";
import { CourseDto, BaseDtoGroups, CourseFilterDto } from "../dto/";

export const CourseRouter = Router();

CourseRouter.post(
  "/",
  AuthMiddleware,
  DtoValidationMiddleware(CourseDto, "body", {
    groups: [BaseDtoGroups.CREATE],
  }),
  courseController.create
);
CourseRouter.get(
  "/",
  DtoValidationMiddleware(CourseFilterDto, "query"),
  courseController.getMany
);
CourseRouter.get("/:id", IdValidationMiddleware, courseController.getOne);
CourseRouter.patch(
  "/:id",
  IdValidationMiddleware,
  AuthMiddleware,
  DtoValidationMiddleware(CourseDto, "body", {
    groups: [BaseDtoGroups.UPDATE],
    skipMissingProperties: true,
  }),
  courseController.update
);
CourseRouter.delete(
  "/:id",
  IdValidationMiddleware,
  AuthMiddleware,
  courseController.delete
);
