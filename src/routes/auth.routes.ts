import { Router } from "express";
import { authController } from "../controllers/";
import { DtoValidationMiddleware, AuthMiddleware } from "../middleware/";
import { UserDto, AuthDtoGroups } from "../dto/";

export const AuthRouter = Router();

AuthRouter.post(
  "/login",
  DtoValidationMiddleware(UserDto, "body", { groups: [AuthDtoGroups.LOGIN] }),
  authController.login
);
AuthRouter.post(
  "/registration",
  DtoValidationMiddleware(UserDto, "body", {
    groups: [AuthDtoGroups.REGISTRATION],
  }),
  authController.registration
);
AuthRouter.get("/logout", AuthMiddleware, authController.logout);
