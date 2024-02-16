import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../entities/User.entity.js";

export class StudentAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { studentId: number }
  ): Promise<boolean> {
    switch (user.role) {
      case Role.ADMIN:
        return true;

      case Role.STUDENT:
        return resourse.studentId === user.studentProfile.id;

      default:
        return false;
    }
  }
}
