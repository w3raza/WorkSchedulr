import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { UserRole } from "../enums/user-role.enum";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthHelper {
  constructor(private userService: UserService) {}

  getUserRoles(): UserRole[] | null {
    const user = this.getCurrentUser();
    if (user) {
      return user.userRoles;
    }
    return null;
  }

  getCurrentUser(): User | null {
    let currentUser: User | null = null;
    this.userService.currentUser$.subscribe((user) => (currentUser = user));
    return currentUser;
  }

  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  checkIsAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles ? roles.includes(UserRole.ADMIN) : false;
  }
}
