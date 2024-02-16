import session from "express-session";
import { AppDataSource } from "../db/data-source.js";
import { Session } from "../entities/Session.entity.js";
import { TypeormStore } from "connect-typeorm";

const sessionRepository = AppDataSource.getRepository(Session);
export const SessionMiddleware = session({
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
});
