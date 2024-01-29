import { AccessStrategy } from "./access-strategy.js";
import { AppDataSource } from "../../db/data-source.js";
import { File } from "../../entities/File.entity.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../entities/User.entity.js";

export class FileAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { fileId: string }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const fileRepository = AppDataSource.getRepository(File);
    if (user.role === Role.TEACHER) {
      return fileRepository.exist({
        where: [
          {
            id: resourse.fileId,
            assignmentAttachment: {
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
          },
          {
            id: resourse.fileId,
            submissionAttachment: {
              submission: {
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
            },
          },
        ],
      });
    }
    if (user.role === Role.STUDENT) {
      return fileRepository.exist({
        where: [
          {
            id: resourse.fileId,
            assignmentAttachment: {
              assignment: {
                course: {
                  enrollments: {
                    student: {
                      user: {
                        id: user.id,
                      },
                    },
                  },
                },
              },
            },
          },
          {
            id: resourse.fileId,
            submissionAttachment: {
              submission: {
                assignment: {
                  course: {
                    enrollments: {
                      student: {
                        user: {
                          id: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      });
    }
    return false;
  }
}
