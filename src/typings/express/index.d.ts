import { UserDto } from "../../dto";
import { User } from "../../entities/User.entity.js";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDto;
    }
  }
}
