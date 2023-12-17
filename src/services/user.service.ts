import { AppDataSource } from "../db/data-source";
import { UserDto } from "../dto/user.dto";
import { Role, User } from "../entities/";
import { BadRequest } from "http-errors";

class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async create(dto: UserDto) {
    const candidate = await this.getByEmail(dto.email);
    if (candidate)
      throw BadRequest(`User with email ${dto.email} already exists`);
    const user = this.userRepository.create(dto as Partial<User>);
    return this.userRepository.save(user);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async getById(id: number, options?: { relations?: any; select?: any }) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      ...(options?.relations && { relations: options.relations }),
      ...(options?.select && { select: options.select }),
    });
    if (!user) throw BadRequest(`User with id ${id} does not exist`);
    return user;
  }

  async updateRole(user: User, role: Role) {
    user.role = role;
    await this.userRepository.save(user);
    return user;
  }
}

export const userService = new UserService();
