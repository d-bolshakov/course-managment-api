import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { TypeormStore } from "connect-typeorm";
import { AppDataSource } from "./db/data-source";
import { Session } from "./entities/";
import { ErrorHandlerMiddleware } from "./middleware/";
import {
  AuthRouter,
  CourseRouter,
  SubjectRouter,
  TeacherRouter,
} from "./routes";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

const sessionRepository = AppDataSource.getRepository(Session);
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      maxAge: Number(process.env.SESSION_MAXAGE),
    },
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: false,
    }).connect(sessionRepository),
  })
);

app.use("/auth/", AuthRouter);
app.use("/subjects/", SubjectRouter);
app.use("/teachers/", TeacherRouter);
app.use("/courses/", CourseRouter);

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
