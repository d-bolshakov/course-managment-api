import type express from "express";
import { getAuthRouter } from "../routes/auth.routes.js";
import { getAssignmentRouter } from "../routes/assignment.routes.js";
import { getCourseRouter } from "../routes/course.routes.js";
import { getFileRouter } from "../routes/file.routes.js";
import { getStudentRouter } from "../routes/student.routes.js";
import { getSubjectRouter } from "../routes/subject.routes.js";
import { getSubmissionRouter } from "../routes/submission.routes.js";
import { getTeacherRouter } from "../routes/teacher.routes.js";
import { getUserRouter } from "../routes/user.routes.js";

export const loadRoutes = (app: express.Application) => {
  app.use("/auth/", getAuthRouter());
  app.use("/users/", getUserRouter());
  app.use("/subjects/", getSubjectRouter());
  app.use("/teachers/", getTeacherRouter());
  app.use("/students/", getStudentRouter());
  app.use("/courses/", getCourseRouter());
  app.use("/assignments/", getAssignmentRouter());
  app.use("/submissions/", getSubmissionRouter());
  app.use("/files/", getFileRouter());
};
