import { Router } from "express";
import { LoginUserDto } from "../dto/user/login-user.dto.js";
import { RegisterUserDto } from "../dto/user/register-user.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller.js";

export const getAuthRouter = () => {
  const AuthRouter = Router();

  const controller = container.resolve<AuthController>("auth-controller");

  AuthRouter.post(
    "/login",
    DtoValidationMiddleware(LoginUserDto, "body"),
    controller.login.bind(controller)
  );
  AuthRouter.post(
    "/registration",
    DtoValidationMiddleware(RegisterUserDto, "body"),
    controller.registration.bind(controller)
  );
  AuthRouter.get("/logout", AuthMiddleware(), controller.logout);
  return AuthRouter;
};
