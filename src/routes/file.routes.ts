import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { container } from "tsyringe";
import type { FileController } from "../controllers/file.controller.js";
import { AccessMiddleware } from "../middleware/access.middleware.js";
import { FileAccessStrategy } from "../middleware/access-strategies/file.access-strategy.js";

export const getFileRouter = () => {
  const FileRouter = Router();

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
  return FileRouter;
};
