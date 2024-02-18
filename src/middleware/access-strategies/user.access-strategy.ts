import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../entities/User.entity.js";

export class UserAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { userId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    return user.id === resourse.userId;
  }
}
