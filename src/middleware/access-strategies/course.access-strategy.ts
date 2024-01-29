import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Course } from "../../entities/Course.entity.js";
import { Enrollment } from "../../entities/Enrollment.entity.js";
import { Role } from "../../entities/User.entity.js";

export class CourseAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { courseId: number }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    if (user.role === Role.TEACHER) {
      const courseRepository = AppDataSource.getRepository(Course);
      return courseRepository.exist({
        where: {
          id: resourse.courseId,
          teacher: {
            user: { id: user.id },
          },
        },
      });
    }
    if (user.role === Role.STUDENT) {
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
      return enrollmentRepository.exist({
        where: {
          courseId: resourse.courseId,
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
