import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { UserRole } from "../../enums/user-role.enum";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() pageTitle!: string;
  @Input() logoSrc!: string;
  role: typeof UserRole = UserRole;

  isAuthenticated: boolean = false;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      console.log("User is authenticated:", isAuthenticated);
    });
  }

  signOut() {
    this.authService.logoutUser().subscribe();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
