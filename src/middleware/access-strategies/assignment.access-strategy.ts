import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Assignment } from "../../entities/Assignment.entity.js";
import { Enrollment } from "../../entities/Enrollment.entity.js";
import { Role } from "../../entities/User.entity.js";

export class AssignmentAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { assignmentId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    if (user.role === Role.TEACHER) {
      const assignmentRepository = AppDataSource.getRepository(Assignment);
      return assignmentRepository.exist({
        where: {
          id: resourse.assignmentId,
          course: {
            teacher: {
              user: { id: user.id },
            },
          },
        },
      });
    }
    if (user.role === Role.STUDENT) {
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
      return enrollmentRepository.exist({
        where: {
          course: {
            assignments: {
              id: resourse.assignmentId,
            },
          },
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
