import { LoginUserDto } from "../../dto/user/login-user.dto";
import { RegisterUserDto } from "../../dto/user/register-user.dto";
import { UserDto } from "../../dto/user/user.dto";

export interface IUserService {
  create(dto: RegisterUserDto): Promise<UserDto>;

  login(dto: LoginUserDto): Promise<UserDto | null>;

  getMany(): Promise<UserDto[]>;

  getById(id: number): Promise<UserDto>;

  delete(id: number): Promise<{ message: string }>;
}
