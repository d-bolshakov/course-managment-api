import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../db/entities/User.entity.js";
import { container } from "tsyringe";
import type { ISubmissionRepository } from "../../repositories/interfaces/submission-repository.interface.js";

export class SubmissionAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { submissionId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const submissionRepository = container.resolve<ISubmissionRepository>(
      "submission-repository"
    );
    if (user.role === Role.TEACHER) {
      if (!user.teacherProfile.id) return false;
      const hasAccess = await submissionRepository.teacherHasAccess(
        resourse.submissionId,
        user.teacherProfile.id
      );
      return hasAccess;
    }
    if (user.role === Role.STUDENT) {
      if (!user.studentProfile.id) return false;
      const hasAccess = await submissionRepository.studentHasAccess(
        resourse.submissionId,
        user.studentProfile.id
      );
      return hasAccess;
    }
    return false;
  }
}
