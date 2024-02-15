import type { UserDto } from "../dto/user/user.dto";

export type UserEvents = {
  "user/regitered": (payload: UserDto) => void;
};
