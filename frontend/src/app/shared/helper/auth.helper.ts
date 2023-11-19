import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { UserRole } from "../enums/user-role.enum";
import { User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthHelper {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  getUserRoles(): UserRole[] | null {
    const user = this.getCurrentUser();
    if (user) {
      return user.userRoles;
    }
    return null;
  }

  getCurrentUser(): User | null {
    let currentUser: User | null = null;

    this.userService.currentUser$
      .subscribe((user) => {
        currentUser = user;
      })
      .unsubscribe();

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
