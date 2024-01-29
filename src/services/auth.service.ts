import bcrypt from "bcryptjs";
import createError from "http-errors";
import { LoginUserDto } from "../dto/user/login-user.dto.js";
import { RegisterUserDto } from "../dto/user/register-user.dto.js";
import { User } from "../entities/User.entity.js";
import { userService } from "./user.service.js";
import { AppDataSource } from "../db/data-source.js";
import { plainToInstance } from "class-transformer";
import { UserDto } from "../dto/user/user.dto.js";

class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async login(dto: LoginUserDto, session: Express.Request["session"]) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      loadRelationIds: {
        disableMixedMap: true,
        relations: ["studentProfile", "teacherProfile"],
      },
    });
    if (!user)
      throw createError.NotFound(`User with email ${dto.email} does not exist`);
    const isPassValid = await bcrypt.compare(dto.password, user.password);
    if (!isPassValid) throw createError.BadRequest("Invalid password");
    session.user = { id: user.id };
    return plainToInstance(UserDto, user, { exposeUnsetFields: false });
  }

  async registration(
    dto: RegisterUserDto,
    session: Express.Request["session"]
  ) {
    const user = await userService.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 3),
    });
    session.user = { id: user.id };
    return user;
  }

  async logout(session: Express.Request["session"]) {
    session.destroy((err) => {
      throw createError.InternalServerError(err);
    });
    return { message: "Logged out successfully" };
  }
}

export const authService = new AuthService();
