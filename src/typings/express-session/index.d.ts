import "express-session";

type SessionUser = {
  id: number;
};

declare module "express-session" {
  export interface SessionData {
    user: SessionUser;
  }
}
