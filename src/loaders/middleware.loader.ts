import cors from "cors";
import express from "express";
import { SessionMiddleware } from "../middleware/session.middleware.js";

export const loadMiddleware = (app: express.Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(SessionMiddleware);
};
