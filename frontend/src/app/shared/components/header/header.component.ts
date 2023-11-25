import { Component, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { UserRole } from "../../enums/user-role.enum";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  @Input() pageTitle!: string;
  @Input() logoSrc!: string;
  role: typeof UserRole = UserRole;
  userId: string | null = null;

  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.userService.getCurrentUser().subscribe((currentUser) => {
      console.log("Value: " + currentUser);
      if (currentUser) {
        this.userId = currentUser.id;
      }
    });
  }

  signOut() {
    this.authService.logoutUser().subscribe();
  }
}
