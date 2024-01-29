import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { LoginUserDto } from "../dto/user/login-user.dto.js";
import { RegisterUserDto } from "../dto/user/register-user.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { DtoValidationMiddleware } from "../middleware/dto-validation.middleware.js";

export const AuthRouter = Router();

AuthRouter.post(
  "/login",
  DtoValidationMiddleware(LoginUserDto, "body"),
  authController.login
);
AuthRouter.post(
  "/registration",
  DtoValidationMiddleware(RegisterUserDto, "body"),
  authController.registration
);
AuthRouter.get("/logout", AuthMiddleware(), authController.logout);
