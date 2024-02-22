import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { UserDto } from "../dto/user/user.dto.js";
import { User } from "../db/entities/User.entity.js";
import { UpdateUserDto } from "../dto/user/update-user.dto.js";
import { AuthDto } from "../dto/user/auth.dto.js";
import type { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { injectable } from "tsyringe";
import type { FilterUserDto } from "../dto/user/filter-user.dto.js";
import type { FindOptionsWhere } from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";

@injectable()
export class UserRepository implements IUserRepository {
  private userRepo = AppDataSource.getRepository(User);

  async create(item: Partial<User>) {
    const user = await this.userRepo.save(item);
    return plainToInstance(UserDto, user, { exposeUnsetFields: false });
  }

  async updateById(id: number, updateDto: UpdateUserDto) {
    try {
      const { affected } = await this.userRepo.update({ id }, updateDto);
      if ((affected as number) > 0) return { success: true };
      return { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async deleteById(id: number) {
    try {
      const { affected } = await this.userRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async getById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailConfirmed: true,
        role: true,
      },
      loadRelationIds: {
        disableMixedMap: true,
        relations: ["studentProfile", "teacherProfile"],
      },
    });
    return plainToInstance(UserDto, user, { exposeUnsetFields: false });
  }

  async getAuthDataByEmail(email: string) {
    const auth = await this.userRepo.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });
    return plainToInstance(AuthDto, auth);
  }

  async getMany(filters?: FilterUserDto) {
    const conditions: FindOptionsWhere<User> = {};
    if (filters?.role) conditions.role = filters.role;
    if (filters?.emailConfirmed)
      conditions.isEmailConfirmed = filters.emailConfirmed;
    const [users, count] = await this.userRepo.findAndCount({
      where: conditions,
      take: 10,
      skip: getPaginationOffset(filters?.page || 1),
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isEmailConfirmed: true,
        role: true,
      },
      loadRelationIds: {
        disableMixedMap: true,
        relations: ["studentProfile", "teacherProfile"],
      },
    });
    return {
      users: plainToInstance(UserDto, users, { exposeUnsetFields: false }),
      count,
    };
  }

  existsWithEmail(email: string) {
    return this.userRepo
      .createQueryBuilder()
      .where("email = :email", { email })
      .getExists();
  }

  existsWithId(id: number) {
    return this.userRepo
      .createQueryBuilder()
      .where("id = :id", { id })
      .getExists();
  }
}
