import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Student } from "../../entities/Student.entity.js";
import { Role } from "../../entities/User.entity.js";

export class StudentAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { studentId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const studentRepository = AppDataSource.getRepository(Student);
    if (user.role === Role.STUDENT) {
      return studentRepository.exist({
        where: {
          id: resourse.studentId,
          user: {
            id: user.id,
          },
        },
      });
    }
    return false;
  }
}
