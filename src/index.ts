import "reflect-metadata";
import "./loaders/di-registry.loader.js";
import express from "express";
import cors from "cors";
import session from "express-session";
import { TypeormStore } from "connect-typeorm";
import { AppDataSource } from "./db/data-source.js";
import { Session } from "./entities/Session.entity.js";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.middleware.js";
import { AssignmentRouter } from "./routes/assignment.routes.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { CourseRouter } from "./routes/course.routes.js";
import { StudentRouter } from "./routes/student.routes.js";
import { SubjectRouter } from "./routes/subject.routes.js";
import { SubmissionRouter } from "./routes/submission.routes.js";
import { TeacherRouter } from "./routes/teacher.routes.js";
import { UserRouter } from "./routes/user.routes.js";
import { Subject } from "./entities/Subject.entity.js";

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
app.use("/users/", UserRouter);
app.use("/subjects/", SubjectRouter);
app.use("/teachers/", TeacherRouter);
app.use("/students/", StudentRouter);
app.use("/courses/", CourseRouter);
app.use("/assignments/", AssignmentRouter);
app.use("/submissions/", SubmissionRouter);

app.get("/test/", async (req: any, res: any, next: any) => {
  const sqb = AppDataSource.createQueryBuilder(Subject, "s")
    .insert()
    .values([{ title: "test1" }, { title: "test2" }]);
  const { identifiers } = await sqb.execute();
  console.log("inserted", identifiers);
  const dqb = AppDataSource.createQueryBuilder(Subject, "s")
    .delete()
    .whereInIds(identifiers.map((i) => i.id))
    .returning("id");
  const result = await dqb.execute();
  console.log("deleted", result);
  res.send(result);
});

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
