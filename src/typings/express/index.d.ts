import { UserDto } from "../../dto/user/user.dto";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDto;
    }
  }
}
