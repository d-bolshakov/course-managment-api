import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../entities/User.entity.js";

export class TeacherAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { teacherId: number }
  ): Promise<boolean> {
    switch (user.role) {
      case Role.ADMIN:
        return true;

      case Role.TEACHER:
        return resourse.teacherId === user.teacherProfile.id;

      default:
        return false;
    }
  }
}
