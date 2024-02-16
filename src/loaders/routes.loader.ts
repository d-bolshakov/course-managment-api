import type express from "express";
import { AuthRouter } from "../routes/auth.routes.js";
import { AssignmentRouter } from "../routes/assignment.routes.js";
import { CourseRouter } from "../routes/course.routes.js";
import { FileRouter } from "../routes/file.routes.js";
import { StudentRouter } from "../routes/student.routes.js";
import { SubjectRouter } from "../routes/subject.routes.js";
import { SubmissionRouter } from "../routes/submission.routes.js";
import { TeacherRouter } from "../routes/teacher.routes.js";
import { UserRouter } from "../routes/user.routes.js";

export const loadRoutes = (app: express.Application) => {
  app.use("/auth/", AuthRouter);
  app.use("/users/", UserRouter);
  app.use("/subjects/", SubjectRouter);
  app.use("/teachers/", TeacherRouter);
  app.use("/students/", StudentRouter);
  app.use("/courses/", CourseRouter);
  app.use("/assignments/", AssignmentRouter);
  app.use("/submissions/", SubmissionRouter);
  app.use("/files/", FileRouter);
};
