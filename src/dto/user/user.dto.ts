import { Role } from "../../entities";

export class UserDto {
  readonly id: number;

  readonly firstName: string;

  readonly lastName: string;

  readonly email: string;

  readonly isEmailConfirmed: boolean;

  readonly password: string;

  readonly role: Role;
}
