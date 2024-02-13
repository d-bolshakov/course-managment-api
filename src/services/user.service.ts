import createError from "http-errors";
import { plainToInstance } from "class-transformer";
import { RegisterUserDto } from "../dto/user/register-user.dto.js";
import { UserDto } from "../dto/user/user.dto.js";
import { Role } from "../entities/User.entity.js";
import { UpdateUserDto } from "../dto/user/update-user.dto.js";
import type { IUserService } from "../interfaces/services/user-service.interface.js";
import bcrypt from "bcryptjs";
import { LoginUserDto } from "../dto/user/login-user.dto.js";
import { inject, injectable, singleton } from "tsyringe";
import type { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import type { ITeacherService } from "../interfaces/services/teacher-service.interface.js";
import type { IStudentService } from "../interfaces/services/student-service.interface.js";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("user-repository") private userRepository: IUserRepository,
    @inject("teacher-service") private teacherService: ITeacherService,
    @inject("student-service") private studentService: IStudentService
  ) {}

  async create(dto: RegisterUserDto) {
    if (await this.userRepository.existsWithEmail(dto.email))
      throw createError.BadRequest(
        `User with email ${dto.email} already exists`
      );
    const user = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: await bcrypt.hash(dto.password, 3),
      role: dto.role,
      email: dto.email,
    });
    let studentProfile, teacherProfile;
    if (user!.role === Role.STUDENT)
      studentProfile = await this.studentService.create(user!.id);
    else if (user!.role === Role.TEACHER)
      teacherProfile = await this.teacherService.create({
        userId: user!.id,
        subjectIds: dto.teacherProfile.subjectIds,
      });
    return plainToInstance(
      UserDto,
      { ...user, studentProfile, teacherProfile },
      {
        exposeUnsetFields: false,
      }
    );
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.getAuthDataByEmail(dto.email);
    if (!user)
      throw createError.NotFound(`User with email ${dto.email} does not exist`);
    const isPassValid = await bcrypt.compare(dto.password, user.password);
    if (!isPassValid) throw createError.BadRequest("Invalid password");
    return this.userRepository.getFullDataById(user.id);
  }

  async getFullDataById(id: number) {
    const user = await this.userRepository.getById(id);
    if (!user) throw createError.NotFound(`User with id ${id} does not exist`);
    return plainToInstance(UserDto, user, {
      exposeUnsetFields: false,
    });
  }

  async getMany() {
    const users = await this.userRepository.getMany();
    return plainToInstance(UserDto, users, {
      exposeUnsetFields: false,
    });
  }

  async getById(id: number) {
    const user = await this.userRepository.getById(id);
    if (!user) throw createError.NotFound(`User with id ${id} does not exist`);
    return plainToInstance(UserDto, user, {
      exposeUnsetFields: false,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    if (!(await this.userRepository.existsWithId(id)))
      throw createError.NotFound(`User with id ${id} does not exist`);
    const { success: isUpdated } = await this.userRepository.updateById(
      id,
      dto
    );
    if (!isUpdated)
      throw createError.InternalServerError(
        `Something went wrong during updating user with id ${id}`
      );
    return this.userRepository.getById(id);
  }

  async delete(id: number) {
    const exists = await this.userRepository.existsWithId(id);
    if (!exists)
      throw createError.NotFound(`User with id ${id} does not exist`);
    const { success: isDeleted } = await this.userRepository.deleteById(id);
    if (!isDeleted)
      throw createError.InternalServerError(
        `Something went wrong during deleteding user with id ${id}`
      );
    return { message: `User with id ${id} was deleted successfully` };
  }
}
