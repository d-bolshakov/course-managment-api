import createError from "http-errors";
import type { IStudentService } from "../interfaces/services/student-service.interface.js";
import { inject, injectable } from "tsyringe";
import type { IStudentRepository } from "../interfaces/repositories/student-repository.interface.js";
import type { IUserService } from "../interfaces/services/user-service.interface.js";
import { Role } from "../entities/User.entity.js";

@injectable()
export class StudentService implements IStudentService {
  constructor(
    @inject("student-repository") private studentRepository: IStudentRepository,
    @inject("user-service") private userService: IUserService
  ) {}

  async create(userId: number) {
    const user = await this.userService.getById(userId);
    if (user.role)
      throw createError.BadRequest(`User with id ${userId} already has a role`);
    if (await this.studentRepository.existsWithUserId(userId))
      throw createError.BadRequest(
        `Student assosiated with user with id ${userId} already exists`
      );
    const student = await this.studentRepository.create({ userId });
    await this.userService.updateRole(userId, Role.STUDENT);
    return this.studentRepository.getById(student.id);
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

  async delete(id: number) {
    const student = await this.studentRepository.getById(id);
    if (!student)
      throw createError.NotFound(`Student with id ${id} does not exist`);
    const result = await this.studentRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleting student with id ${id}`
      );
    await this.userService.updateRole(student.userId, null);
    return result;
  }
}
