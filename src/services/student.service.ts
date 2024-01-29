import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { plainToInstance } from "class-transformer";
import { Student } from "../entities/Student.entity.js";
import { StudentDto } from "../dto/student/student.dto.js";

class StudentService {
  private studentRepository = AppDataSource.getRepository(Student);

  async create(userId: number) {
    const candidate = await this.studentRepository.findOne({
      where: { id: userId },
    });
    if (candidate)
      throw createError.BadRequest(
        `Student assosiated with user with id ${userId} already exists`
      );
    const student = this.studentRepository.create({ userId });
    await this.studentRepository.save(student);
    return plainToInstance(StudentDto, student, {
      exposeUnsetFields: false,
    });
  }

  async getMany(options?: { filters: { page: number } }) {
    const students = await this.studentRepository.find({
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
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(StudentDto, students, {
      exposeUnsetFields: false,
    });
  }

  async getFullDataById(id: number) {
    const student = await this.studentRepository.findOne({
      relations: {
        user: true,
      },
      where: { id },
      select: {
        id: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
    if (!student)
      throw createError.NotFound(`Student with id ${id} does not exist`);
    return plainToInstance(StudentDto, student, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, bode: any) {}

  async delete(id: number) {}
}

export const studentService = new StudentService();
