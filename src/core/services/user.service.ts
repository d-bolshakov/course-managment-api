import createError from "http-errors";
import { plainToInstance } from "class-transformer";
import { RegisterUserDto } from "../../dto/user/register-user.dto.js";
import { UserDto } from "../../dto/user/user.dto.js";
import { Role } from "../../db/entities/User.entity.js";
import { UpdateUserDto } from "../../dto/user/update-user.dto.js";
import type { IUserService } from "./interfaces/user-service.interface.js";
import bcrypt from "bcryptjs";
import { LoginUserDto } from "../../dto/user/login-user.dto.js";
import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "../../repositories/interfaces/user-repository.interface.js";
import type { FilterUserDto } from "../../dto/user/filter-user.dto.js";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("user-repository") private userRepository: IUserRepository
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
      email: dto.email,
    });
    return user;
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.getAuthDataByEmail(dto.email);
    if (!user)
      throw createError.NotFound(`User with email ${dto.email} does not exist`);
    const isPassValid = await bcrypt.compare(dto.password, user.password);
    if (!isPassValid) throw createError.BadRequest("Invalid password");
    return this.userRepository.getById(user.id);
  }

  async getMany(options?: { filters?: FilterUserDto }) {
    return this.userRepository.getMany(options?.filters);
  }

  async getById(id: number) {
    const user = await this.userRepository.getById(id);
    if (!user) throw createError.NotFound(`User with id ${id} does not exist`);
    return user;
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
    return this.getById(id);
  }

  async updateRole(id: number, role: Role | null) {
    return this.userRepository.updateById(id, { role });
  }

  async delete(id: number) {
    const exists = await this.userRepository.existsWithId(id);
    if (!exists)
      throw createError.NotFound(`User with id ${id} does not exist`);
    const result = await this.userRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleting user with id ${id}`
      );
    return result;
  }
}
