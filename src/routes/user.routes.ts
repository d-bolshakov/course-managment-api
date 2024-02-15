import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { IdValidationMiddleware } from "../middleware/id-validation.middleware.js";
import { container } from "tsyringe";
import type { UserController } from "../controllers/user.controller.js";
import { UpdateUserDto } from "../dto/user/update-user.dto.js";
import { MeMiddleware } from "../middleware/me.middleware.js";
import { RoleMiddleware } from "../middleware/role.middleware.js";
import { Role } from "../entities/User.entity.js";
import { FilterUserDto } from "../dto/user/filter-user.dto.js";

export const UserRouter = Router();

const controller = container.resolve<UserController>("user-controller");

UserRouter.get(
  "/",
  AuthMiddleware(),
  RoleMiddleware({ target: [Role.ADMIN] }),
  DtoValidationMiddleware(FilterUserDto, "query"),
  controller.getMany.bind(controller)
);
UserRouter.get(
  "/:userId",
  AuthMiddleware({ passOnRedirect: true }),
  MeMiddleware({ targetReqParam: "userId" }),
  IdValidationMiddleware("userId"),
  controller.getOne.bind(controller)
);
UserRouter.put(
  "/:userId",
  AuthMiddleware({ passOnRedirect: true }),
  MeMiddleware({ targetReqParam: "userId" }),
  IdValidationMiddleware("userId"),
  DtoValidationMiddleware(UpdateUserDto, "body"),
  controller.update.bind(controller)
);
UserRouter.delete(
  "/:userId",
  AuthMiddleware({ passOnRedirect: true }),
  MeMiddleware({ targetReqParam: "userId" }),
  IdValidationMiddleware("userId"),
  controller.delete.bind(controller)
);