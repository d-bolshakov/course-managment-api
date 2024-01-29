import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import { plainToInstance } from "class-transformer";
import { studentService } from "./student.service.js";
import { teacherService } from "./teacher.service.js";
import { RegisterUserDto } from "../dto/user/register-user.dto.js";
import { UserDto } from "../dto/user/user.dto.js";
import { User, Role } from "../entities/User.entity.js";
import { UpdateUserDto } from "../dto/user/update-user.dto.js";

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async create(dto: RegisterUserDto) {
    if (await this.isEmailNotUnique(dto.email))
      throw createError.BadRequest(
        `User with email ${dto.email} already exists`
      );
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      role: dto.role,
      email: dto.email,
    });
    await this.userRepository.save(user);
    let studentProfile, teacherProfile;
    if (user.role === Role.STUDENT)
      studentProfile = await studentService.create(user.id);
    else if (user.role === Role.TEACHER)
      teacherProfile = await teacherService.create(user.id, dto.teacherProfile);
    return plainToInstance(
      UserDto,
      { ...user, studentProfile, teacherProfile },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async getFullDataById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        teacherProfile: {
          subjects: true,
        },
        studentProfile: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailConfirmed: true,
        role: true,
        studentProfile: {
          id: true,
        },
        teacherProfile: {
          id: true,
          subjects: true,
        },
      },
    });
    if (!user) throw createError.NotFound(`User with id ${id} does not exist`);
    return plainToInstance(UserDto, user, {
      exposeUnsetFields: false,
    });
  }

  async getMany() {
    const users = await this.userRepository.find({
      relations: {
        studentProfile: true,
        teacherProfile: {
          subjects: true,
        },
      },
    });
    return plainToInstance(UserDto, users, {
      exposeUnsetFields: false,
    });
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw createError.NotFound(`User with id ${id} does not exist`);
    return plainToInstance(UserDto, user, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.getById(id);
  }

  async delete(id: number) {
    const exists = await this.userRepository
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
    if (!exists)
      throw new createError.NotFound(`User with id ${id} does not exist`);
    await this.userRepository.delete({ id });
    return { message: `User with id ${id} was deleted successfully` };
  }

  async isEmailNotUnique(email: string) {
    return this.userRepository
      .createQueryBuilder("u")
      .where("email = :email", { email })
      .getExists();
  }
}

export const userService = new UserService();
