import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Enrollment } from "../../entities/Enrollment.entity.js";
import { Role } from "../../entities/User.entity.js";

export class EnrollmentAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { enrollmentId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const enrollmentRepository = AppDataSource.getRepository(Enrollment);
    if (user.role === Role.TEACHER) {
      return enrollmentRepository.exist({
        where: {
          id: resourse.enrollmentId,
          course: {
            teacher: {
              user: { id: user.id },
            },
          },
        },
      });
    }
    if (user.role === Role.STUDENT) {
      return enrollmentRepository.exist({
        where: {
          id: resourse.enrollmentId,
          student: {
            user: {
              id: user.id,
            },
          },
        },
      });
    }
    return false;
  }
}
