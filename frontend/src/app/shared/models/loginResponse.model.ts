import { UserRole } from "../enums/user-role.enum";

export interface LoginResponse {
  id: string;
  email: string;
  userRoles: UserRole[];
  token: string;
}
