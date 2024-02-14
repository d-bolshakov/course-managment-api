import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { Student } from "../entities/Student.entity.js";
import { StudentDto } from "../dto/student/student.dto.js";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import type { IStudentRepository } from "../interfaces/repositories/student-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class StudentRepository implements IStudentRepository {
  private studentRepo = AppDataSource.getRepository(Student);

  async create(dto: { userId: number }) {
    const student = await this.studentRepo.save(dto);
    return plainToInstance(StudentDto, student, { exposeUnsetFields: false });
  }

  async getById(id: number) {
    const student = await this.studentRepo.findOne({
      relations: {
        user: true,
      },
      where: { id },
      select: {
        id: true,
        userId: true,
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
    return plainToInstance(StudentDto, student, {
      exposeUnsetFields: false,
    });
  }

  async getMany(filters?: { page: number }) {
    const [students, count] = await this.studentRepo.findAndCount({
      relations: { user: true },
      select: {
        id: true,
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      take: 10,
      skip: getPaginationOffset(filters?.page || 1),
    });
    return {
      students: plainToInstance(StudentDto, students, {
        exposeUnsetFields: false,
      }),
      count,
    };
  }

  async deleteById(id: number) {
    try {
      const { affected } = await this.studentRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }

  async existsWithUserId(userId: number) {
    return this.studentRepo
      .createQueryBuilder("s")
      .where("s.userId = :userId", { userId })
      .getExists();
  }

  async existsWithId(id: number) {
    return this.studentRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }
}
