import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { TypeormStore } from "connect-typeorm";
import { AppDataSource } from "./db/data-source.js";
import { Session } from "./entities/Session.entity.js";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.middleware.js";

import fileUpload from "express-fileupload";
import { AssignmentRouter } from "./routes/assignment.routes.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { CourseRouter } from "./routes/course.routes.js";
import { StudentRouter } from "./routes/student.routes.js";
import { SubjectRouter } from "./routes/subject.routes.js";
import { SubmissionRouter } from "./routes/submission.routes.js";
import { TeacherRouter } from "./routes/teacher.routes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());

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
app.use("/students/", StudentRouter);
app.use("/courses/", CourseRouter);
app.use("/assignments/", AssignmentRouter);
app.use("/submissions/", SubmissionRouter);

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
