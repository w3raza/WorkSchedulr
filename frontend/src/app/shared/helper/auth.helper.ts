import { UserRole } from "../enums/user-role.enum";

export class AuthHelper {
  static getUserRole() {
    const user = this.getCurrentUser();
    if (user) {
      return JSON.parse(user).userRoles;
    }
  }

  static getCurrentUser(): string | null {
    return localStorage.getItem("currentUser");
  }

  static getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    if (user) {
      return JSON.parse(user).id;
    } else {
      return null;
    }
  }

  static checkIsAdmin(): boolean {
    return AuthHelper.getUserRole() === UserRole.ADMIN;
  }
}
