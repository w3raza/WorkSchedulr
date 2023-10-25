import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from "@angular/core";
import { LoginResponse } from "../models/loginResponse.model";
import { Subscription } from "rxjs";
import { UserService } from "../services/user.service";

@Directive({ selector: "[forRoles]" })
export class ForRolesDirective implements OnDestroy {
  private roles: string[] = [];
  private userLogin: LoginResponse | null = null;
  private subscription: Subscription;

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
    this.subscription = this.userService.currentUser$.subscribe(
      (currentUser) => {
        if (currentUser) {
          this.userLogin = currentUser;
          this.updateView();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setRoles(roles: string | string[]) {
    this.roles = roles ? convertToStringArray(roles) : [];
  }

  private updateView() {
    if (!this.userLogin || !this.userLogin.userRoles) return;

    const userRoles = convertToStringArray(this.userLogin.userRoles);
    const hasMatchingRole = userRoles.some((role) => this.roles.includes(role));

    if (hasMatchingRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

function convertToStringArray(roles: string | string[]): string[] {
  return Array.isArray(roles) ? roles : [roles];
}
