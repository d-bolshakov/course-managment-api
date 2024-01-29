import { UserDto } from "../../dto/user/user.dto.js";
import { AccessStrategy } from "./access-strategy";

export class AccessContext {
  private strategy: AccessStrategy;

  constructor(strategy: AccessStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: AccessStrategy) {
    this.strategy = strategy;
  }

  async checkAccess(user: UserDto, resourse: any): Promise<boolean> {
    return this.strategy.hasAccess(user, resourse);
  }
}
