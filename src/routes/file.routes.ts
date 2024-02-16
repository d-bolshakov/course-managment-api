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
import type { FileController } from "../controllers/file.controller.js";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { FileAccessStrategy } from "../middleware/access-strategies/file.access-strategy.js";

export const FileRouter = Router();

const controller = container.resolve<FileController>("file-controller");

FileRouter.get(
  "/:fileId",
  AuthMiddleware(),
  AccessMiddleware(new FileAccessStrategy(), {
    property: "fileId",
    propertyLocation: "params",
  }),
  controller.getOne.bind(controller)
);
