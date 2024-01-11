import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Role, User, Student } from "../entities";
import { userService } from ".";
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";

class StudentService {
  private studentRepository = AppDataSource.getRepository(Student);

  async create(user: User) {
    const candidate = await this.studentRepository.findOne({
      where: { id: user.id },
    });
    if (candidate)
      throw BadRequest(
        `Student assosiated with user with id ${user.id} already exists`
      );
    const student = new Student();
    student.user = user;
    await this.studentRepository.save(student);
    await userService.updateRole(user, Role.STUDENT);
    return student;
  }

  async getOne(
    conditions: FindOptionsWhere<Student>,
    options?: {
      relations?: FindOptionsRelations<Student>;
      select?: FindOptionsSelect<Student>;
    }
  ) {
    return this.studentRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options?: {
    conditions?: FindOptionsWhere<Student>;
    relations?: FindOptionsRelations<Student>;
    select?: FindOptionsSelect<Student>;
    disablePagination?: boolean;
    page?: number;
  }) {
    const findOptions: FindManyOptions<Student> = {
      where: options?.conditions,
      relations: options?.relations,
      select: options?.select,
    };
    if (!options?.disablePagination) {
      findOptions.take = 10;
      findOptions.skip = getPaginationOffset(options?.page || 1);
    }
    return this.studentRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Student>;
      select?: FindOptionsSelect<Student>;
    }
  ) {
    const student = await this.getOne({ id }, options);
    if (!student) throw BadRequest(`Student with id ${id} does not exist`);
    return student;
  }

  async getByUserId(id: number, options?: any) {
    const student = await this.getOne({ user: { id } }, options?.relations);
    if (!student)
      throw BadRequest(
        `Student associated with user with id ${id} does not exist`
      );
    return student;
  }

  async delete(id: number) {
    const student = await this.getById(id);
    await userService.updateRole(student.user, Role.STUDENT);
    await this.studentRepository.remove(student);
    return { message: `Student with id ${id} was deleted successfully` };
  }
}

export const studentService = new StudentService();
