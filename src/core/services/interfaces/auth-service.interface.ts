import { LoginUserDto } from "../../../dto/user/login-user.dto";
import { RegisterUserDto } from "../../../dto/user/register-user.dto";
import { UserDto } from "../../../dto/user/user.dto";

export interface IAuthService {
  login(
    dto: LoginUserDto,
    session: Express.Request["session"]
  ): Promise<UserDto | null>;

  registration(
    dto: RegisterUserDto,
    session: Express.Request["session"]
  ): Promise<UserDto>;

  logout(session: Express.Request["session"]): Promise<{ message: string }>;
}
