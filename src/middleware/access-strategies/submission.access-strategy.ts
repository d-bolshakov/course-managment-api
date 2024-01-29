import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Submission } from "../../entities/Submission.entity.js";
import { Role } from "../../entities/User.entity.js";

export class SubmissionAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { submissionId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const submissionRepository = AppDataSource.getRepository(Submission);
    if (user.role === Role.TEACHER) {
      return submissionRepository.exist({
        where: {
          id: resourse.submissionId,
          assignment: {
            course: {
              teacher: {
                user: {
                  id: user.id,
                },
              },
            },
          },
        },
      });
    }
    if (user.role === Role.STUDENT) {
      return submissionRepository.exist({
        where: {
          id: resourse.submissionId,
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
