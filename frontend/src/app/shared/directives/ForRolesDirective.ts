import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";

@Directive({ selector: "[forRoles]" })
export class ForRolesDirective {
  private roles: string[] = [];
  private user: User | null = null;
  private viewCreated: boolean = false;

  @Input()
  set forRoles(roles: string | string[]) {
    this.setRoles(roles);
    this.updateView();
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<string>,
    private userService: UserService
  ) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      this.userService.getCurrentUser().subscribe((currentUser) => {
        if (currentUser) {
          this.user = currentUser;
          this.updateView();
        }
      });
    }
  }

  private setRoles(roles: string | string[]) {
    this.roles = roles ? convertToStringArray(roles) : [];
  }

  private updateView() {
    if (!this.user || !this.user.userRoles) {
      this.viewContainer.clear();
      this.viewCreated = false;
      return;
    }

    const userRoles = convertToStringArray(this.user.userRoles);
    const hasMatchingRole = userRoles.some((role) => this.roles.includes(role));

    if (hasMatchingRole && !this.viewCreated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.viewCreated = true;
    } else if (!hasMatchingRole && this.viewCreated) {
      this.viewContainer.clear();
      this.viewCreated = false;
    }
  }
}

function convertToStringArray(roles: string | string[]): string[] {
  return Array.isArray(roles) ? roles : [roles];
}
