import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Teacher } from "../../entities/Teacher.entity.js";
import { Role } from "../../entities/User.entity.js";

export class TeacherAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { teacherId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const teacherRepository = AppDataSource.getRepository(Teacher);
    if (user.role === Role.TEACHER) {
      return teacherRepository.exist({
        where: {
          id: resourse.teacherId,
          user: {
            id: user.id,
          },
        },
      });
    }
    return false;
  }
}
