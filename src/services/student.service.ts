import createError from "http-errors";
import type { IStudentService } from "../interfaces/services/student-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { IStudentRepository } from "../interfaces/repositories/student-repository.interface.js";

@injectable()
export class StudentService implements IStudentService {
  constructor(
    @inject("student-repository") private studentRepository: IStudentRepository
  ) {}

  async create(userId: number) {
    if (await this.studentRepository.existsWithUserId(userId))
      throw createError.BadRequest(
        `Student assosiated with user with id ${userId} already exists`
      );
    const student = await this.studentRepository.create({ userId });
    return student;
  }

  async getMany(options?: { filters: { page: number } }) {
    return this.studentRepository.getMany(options?.filters);
  }

  async getById(id: number) {
    const student = await this.studentRepository.getById(id);
    if (!student)
      throw createError.NotFound(`Student with id ${id} does not exist`);
    return student;
  }

  async update(id: number, bode: any) {}

  async delete(id: number) {}
}
