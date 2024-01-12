import { Router } from "express";
import { subjectController } from "../controllers/";
import {
  DtoValidationMiddleware,
  IdValidationMiddleware,
  AuthMiddleware,
} from "../middleware/";
import { CreateSubjectDto, UpdateSubjectDto } from "../dto/";

export const SubjectRouter = Router();

SubjectRouter.post(
  "/",
  AuthMiddleware,
  DtoValidationMiddleware(CreateSubjectDto, "body"),
  subjectController.create
);
SubjectRouter.get("/", subjectController.getMany);
SubjectRouter.get("/:id", IdValidationMiddleware(), subjectController.getOne);
SubjectRouter.patch(
  "/:id",
  IdValidationMiddleware(),
  AuthMiddleware,
  DtoValidationMiddleware(UpdateSubjectDto, "body"),
  subjectController.update
);
SubjectRouter.delete(
  "/:id",
  IdValidationMiddleware(),
  AuthMiddleware,
  subjectController.delete
);
