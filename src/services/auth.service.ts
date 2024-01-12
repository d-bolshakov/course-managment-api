import { hash, compare } from "bcryptjs";
import { BadRequest, InternalServerError } from "http-errors";
import { userService } from "./";
import { LoginUserDto, RegisterUserDto } from "../dto/";

class AuthService {
  async login(dto: LoginUserDto, session: Express.Request["session"]) {
    const user = await userService.getByEmail(dto.email);
    if (!user) throw BadRequest(`User with email ${dto.email} does not exist`);
    const isPassValid = await compare(dto.password, user.password);
    if (!isPassValid) throw BadRequest("Invalid password");
    session.user = { id: user.id };
    return user;
  }

  async registration(
    dto: RegisterUserDto,
    session: Express.Request["session"]
  ) {
    const user = await userService.create({
      ...dto,
      password: await hash(dto.password, 3),
    });
    session.user = { id: user.id };
    return user;
  }

  async logout(session: Express.Request["session"]) {
    session.destroy((err) => {
      throw InternalServerError(err);
    });
    return { message: "Logged out successfully" };
  }
}

export const authService = new AuthService();
