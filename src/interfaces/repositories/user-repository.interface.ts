import { AuthDto } from "../../dto/user/auth.dto";
import { UpdateUserDto } from "../../dto/user/update-user.dto";
import { UserDto } from "../../dto/user/user.dto";
import { User } from "../../entities/User.entity";

export interface IUserRepository {
  create(item: Partial<User>): Promise<UserDto | null>;
  updateById(
    id: number,
    updateDto: UpdateUserDto
  ): Promise<{ success: boolean }>;
  deleteById(id: number): Promise<{ success: boolean }>;
  getById(id: number): Promise<UserDto | null>;
  getAuthDataByEmail(email: string): Promise<AuthDto | null>;
  getMany(): Promise<UserDto[]>;
  existsWithEmail(email: string): Promise<boolean>;
  existsWithId(id: number): Promise<boolean>;
}
