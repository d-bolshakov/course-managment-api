import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../entities/User.entity.js";
import { container } from "tsyringe";
import type { IAssignmentRepository } from "../../interfaces/repositories/assignment-repository.interface.js";

export class AssignmentAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { assignmentId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const assignmentRepository = container.resolve<IAssignmentRepository>(
      "assignment-repository"
    );
    if (user.role === Role.TEACHER) {
      if (!user.teacherProfile.id) return false;
      const hasAccess = assignmentRepository.teacherHasAccess(
        resourse.assignmentId,
        user.teacherProfile.id
      );
      return hasAccess;
    }
    if (user.role === Role.STUDENT) {
      if (!user.studentProfile.id) return false;
      const hasAccess = assignmentRepository.studentHasAccess(
        resourse.assignmentId,
        user.studentProfile.id
      );
      return hasAccess;
    }
    return false;
  }
}
