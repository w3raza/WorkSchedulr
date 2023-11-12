import { UserRole } from "../enums/user-role.enum";

export class AuthHelper {
  static getUserRole() {
    const user = localStorage.getItem("currentUser");
    if (user) {
      return JSON.parse(user).userRoles;
    }
  }

  static getCurrentUserId(): string | null {
    return localStorage.getItem("id");
  }

  static checkIsAdmin(): boolean {
    return AuthHelper.getUserRole() === UserRole.ADMIN;
  }
}
