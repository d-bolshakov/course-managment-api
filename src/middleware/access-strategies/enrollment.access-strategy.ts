import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../db/entities/User.entity.js";
import { container } from "tsyringe";
import type { IEnrollmentRepository } from "../../interfaces/repositories/enrollment-repository.interface.js";

export class EnrollmentAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { enrollmentId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const enrollmentRepository = container.resolve<IEnrollmentRepository>(
      "enrollment-repository"
    );
    if (user.role === Role.TEACHER) {
      if (!user.teacherProfile.id) return false;
      const hasAccess = enrollmentRepository.teacherHasAccess(
        resourse.enrollmentId,
        user.teacherProfile.id
      );
      return hasAccess;
    }
    if (user.role === Role.STUDENT) {
      if (!user.studentProfile.id) return false;
      const hasAccess = enrollmentRepository.studentHasAccess(
        resourse.enrollmentId,
        user.studentProfile.id
      );
      return hasAccess;
    }
    return false;
  }
}
