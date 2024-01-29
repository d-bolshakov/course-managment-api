import { Router } from "express";
import { subjectController } from "../controllers/subject.controller.js";
import { CreateSubjectDto } from "../dto/subject/create-subject.dto.js";
import { UpdateSubjectDto } from "../dto/subject/update-subject.dto.js";
import { Role } from "../entities/User.entity.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";

export const SubjectRouter = Router();

SubjectRouter.post(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.TEACHER] }),
  DtoValidationMiddleware(CreateSubjectDto, "body"),
  subjectController.create
);
SubjectRouter.get("/", subjectController.getMany);
SubjectRouter.get("/:id", IdValidationMiddleware(), subjectController.getOne);
SubjectRouter.patch(
  "/:id",
  IdValidationMiddleware(),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.ADMIN] }),
  DtoValidationMiddleware(UpdateSubjectDto, "body"),
  subjectController.update
);
SubjectRouter.delete(
  "/:id",
  IdValidationMiddleware(),
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.ADMIN] }),
  subjectController.delete
);
