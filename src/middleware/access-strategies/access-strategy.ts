import { UserDto } from "../../dto/user/user.dto.js";

export interface AccessStrategy {
  hasAccess(user: UserDto, resource: any): Promise<boolean>;
}
