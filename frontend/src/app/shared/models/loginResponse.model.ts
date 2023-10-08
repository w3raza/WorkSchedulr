import { UserRole } from "../enums/user-role.enum";

export class LoginResponse {
  constructor(
    public id: string,
    public email: string,
    public token: string,
    public roles: UserRole[]
  ) {}

  getId() {
    return this.id;
  }
}
