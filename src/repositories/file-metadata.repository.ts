import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { File } from "../db/entities/File.entity.js";
import { FileMetadataDto } from "../dto/file-metadata/file-metadata.dto.js";
import { CreateFileMetadataDto } from "../dto/file-metadata/create-file-metadata.dto.js";
import type { IFileMetadataRepository } from "../interfaces/repositories/file-metadata-repository.interface.js";
import { injectable } from "tsyringe";
import { In } from "typeorm";

@injectable()
export class FileMetadataRepository implements IFileMetadataRepository {
  private fileRepo = AppDataSource.getRepository(File);

  async create(dto: CreateFileMetadataDto | CreateFileMetadataDto[]) {
    // @ts-expect-error
    const file = await this.fileRepo.save(dto);
    return plainToInstance(FileMetadataDto, file, {
      exposeUnsetFields: false,
    });
  }
  async deleteById(id: string | string[]) {
    const qb = this.fileRepo.createQueryBuilder().delete().returning("id");
    if (Array.isArray(id)) qb.whereInIds(id);
    else qb.where("id = :id", { id });
    const { raw } = await qb.execute();
    return { deleted: raw };
  }
  async getById(id: string) {
    const file = await this.fileRepo.findOne({ where: { id } });
    return plainToInstance(FileMetadataDto, file, {
      exposeUnsetFields: false,
    });
  }

  async getManyById(ids: string[]): Promise<FileMetadataDto[]> {
    const files = await this.fileRepo.find({ where: { id: In(ids) } });
    return plainToInstance(FileMetadataDto, files, {
      exposeUnsetFields: false,
    });
  }

  // check if the file belongs to an attachment of a submission that was created by the student
  // or if the file belongs to an attachment of an assignment that belongs to a course, which the student is enrolled to
  studentHasAccess(fileId: string, studentId: number): Promise<boolean> {
    return this.fileRepo.exist({
      where: [
        {
          id: fileId,
          assignmentAttachment: {
            assignment: {
              course: {
                enrollments: {
                  studentId,
                },
              },
            },
          },
        },
        {
          id: fileId,
          submissionAttachment: {
            submission: {
              assignment: {
                course: {
                  enrollments: {
                    studentId,
                  },
                },
              },
            },
          },
        },
      ],
    });
  }

  // check if the file belongs to an attachment of an assignment that was created by the teacher
  // of if the file belongs to an attachment of a submission that belongs to an assignment created be the teacher
  teacherHasAccess(fileId: string, teacherId: number): Promise<boolean> {
    return this.fileRepo.exist({
      where: [
        {
          id: fileId,
          assignmentAttachment: {
            assignment: {
              course: {
                teacherId,
              },
            },
          },
        },
        {
          id: fileId,
          submissionAttachment: {
            submission: {
              assignment: {
                course: {
                  teacherId,
                },
              },
            },
          },
        },
      ],
    });
  }
}
