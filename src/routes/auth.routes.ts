import { Router } from "express";
import { authController } from "../controllers/";
import { DtoValidationMiddleware, AuthMiddleware } from "../middleware/";
import { LoginUserDto, RegisterUserDto } from "../dto/";

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
AuthRouter.get("/logout", AuthMiddleware, authController.logout);
