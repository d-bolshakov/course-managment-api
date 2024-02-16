import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../entities/User.entity.js";
import { container } from "tsyringe";
import type { ICourseRepository } from "../../interfaces/repositories/course-repository.interface.js";

export class CourseAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { courseId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const courseRepository =
      container.resolve<ICourseRepository>("course-repository");
    if (user.role === Role.TEACHER) {
      if (!user.teacherProfile.id) return false;
      const hasAccess = await courseRepository.teacherHasAccess(
        resourse.courseId,
        user.teacherProfile.id
      );
      return hasAccess;
    }
    if (user.role === Role.STUDENT) {
      if (!user.studentProfile.id) return false;
      const hasAccess = await courseRepository.studentHasAccess(
        resourse.courseId,
        user.studentProfile.id
      );
      return hasAccess;
    }
    return false;
  }
}
