import type { AccessStrategy } from "./access-strategy.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../db/entities/User.entity.js";
import { container } from "tsyringe";
import type { IFileMetadataRepository } from "../../interfaces/repositories/file-metadata-repository.interface.js";

export class FileAccessStrategy implements AccessStrategy {
  async hasAccess(
    user: UserDto,
    resourse: { fileId: string }
  ): Promise<boolean> {
    if (user.role === Role.ADMIN) return true;
    const fileRepository = container.resolve<IFileMetadataRepository>(
      "file-metadata-repository"
    );
    if (user.role === Role.TEACHER) {
      if (!user.teacherProfile.id) return false;
      const hasAccess = await fileRepository.teacherHasAccess(
        resourse.fileId,
        user.teacherProfile.id
      );
      return hasAccess;
    }
    if (user.role === Role.STUDENT) {
      if (!user.studentProfile.id) return false;
      const hasAccess = await fileRepository.studentHasAccess(
        resourse.fileId,
        user.studentProfile.id
      );
      return hasAccess;
    }
    return false;
  }
}
