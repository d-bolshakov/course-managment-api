import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IUserService } from "../interfaces/services/user-service.interface.js";

@injectable()
export class UserController {
  constructor(@inject("user-service") private userService: IUserService) {}

  async getOne(
    { params: { userId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.userService.getById(Number(userId));
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async getMany({ query }: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.getMany({ filters: query });
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  async update(
    { params: { userId }, body }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.userService.update(Number(userId), body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  async delete(
    { params: { userId } }: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(201).json(this.userService.delete(Number(userId)));
    } catch (e) {
      next(e);
    }
  }
}
