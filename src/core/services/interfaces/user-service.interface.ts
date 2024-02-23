import type { FilterUserDto } from "../../../dto/user/filter-user.dto";
import { LoginUserDto } from "../../../dto/user/login-user.dto";
import { RegisterUserDto } from "../../../dto/user/register-user.dto";
import type { UpdateUserDto } from "../../../dto/user/update-user.dto";
import { UserDto } from "../../../dto/user/user.dto";
import type { Role } from "../../../db/entities/User.entity";

export interface IUserService {
  create(dto: RegisterUserDto): Promise<UserDto>;

  login(dto: LoginUserDto): Promise<UserDto | null>;

  getMany(options?: {
    filters?: FilterUserDto;
  }): Promise<{ users: UserDto[]; count: number }>;

  getById(id: number): Promise<UserDto>;

  delete(id: number): Promise<{ success: boolean }>;

  update(id: number, dto: UpdateUserDto): Promise<UserDto>;

  updateRole(id: number, role: Role | null): Promise<{ success: boolean }>;
}
