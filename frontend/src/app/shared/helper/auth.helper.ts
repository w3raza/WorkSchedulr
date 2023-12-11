import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { UserRole } from "../enums/userRole.enum";

@Injectable({
  providedIn: "root",
})
export class AuthHelper {
  userRole: UserRole[] | null = null;
  constructor(private userService: UserService) {
    this.fetchUserRole();
  }

  fetchUserRole() {
    this.userService.getCurrentUser().subscribe((currentUser) => {
      if (currentUser) {
        this.userRole = currentUser.userRoles;
      }
    });
  }

  getUserRoles(): UserRole[] | null {
    if (!this.userRole) {
      this.fetchUserRole();
    }
    return this.userRole;
  }

  checkIsAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles ? roles.includes(UserRole.ADMIN) : false;
  }

  checkIsManager(): boolean {
    const roles = this.getUserRoles();
    return roles ? roles.includes(UserRole.MANAGER) : false;
  }

  checkIsNotUser(): boolean {
    return this.checkIsAdmin() || this.checkIsManager();
  }
}
