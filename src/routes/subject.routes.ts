import { Router } from "express";
import { CreateSubjectDto } from "../dto/subject/create-subject.dto.js";
import { UpdateSubjectDto } from "../dto/subject/update-subject.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";
import { container } from "tsyringe";
import type { SubjectController } from "../controllers/subject.controller.js";
import { FilterSubjectDto } from "../dto/subject/filter-subject.dto.js";

export const SubjectRouter = Router();

const controller = container.resolve<SubjectController>("subject-controller");

SubjectRouter.post(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  DtoValidationMiddleware(CreateSubjectDto, "body"),
  controller.create.bind(controller)
);
SubjectRouter.get(
  "/",
  DtoValidationMiddleware(FilterSubjectDto, "query"),
  controller.getMany
);
SubjectRouter.get("/:id", controller.getOne.bind(controller));
SubjectRouter.patch(
  "/:id",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.ADMIN] }),
  DtoValidationMiddleware(UpdateSubjectDto, "body"),
  controller.update.bind(controller)
);
SubjectRouter.delete(
  "/:id",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.ADMIN] }),
  controller.delete.bind(controller)
);
