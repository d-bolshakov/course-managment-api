import { Router } from "express";
import { subjectController } from "../controllers/";
import {
  DtoValidationMiddleware,
  IdValidationMiddleware,
  AuthMiddleware,
} from "../middleware/";
import { SubjectDto, BaseDtoGroups } from "../dto/";

export const SubjectRouter = Router();

SubjectRouter.post(
  "/",
  AuthMiddleware,
  DtoValidationMiddleware(SubjectDto, "body", {
    groups: [BaseDtoGroups.CREATE],
  }),
  subjectController.create
);
SubjectRouter.get("/", subjectController.getMany);
SubjectRouter.get("/:id", IdValidationMiddleware, subjectController.getOne);
SubjectRouter.patch(
  "/:id",
  IdValidationMiddleware,
  AuthMiddleware,
  DtoValidationMiddleware(SubjectDto, "body", {
    groups: [BaseDtoGroups.UPDATE],
  }),
  subjectController.update
);
SubjectRouter.delete(
  "/:id",
  IdValidationMiddleware,
  AuthMiddleware,
  subjectController.delete
);
