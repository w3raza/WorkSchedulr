import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { UserRole } from "../shared/enums/user-role.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle!: string;
  @Input() logoSrc!: string;
  role: typeof UserRole = UserRole;

  userLogin: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userLogin$.subscribe((userLogin) => {
      this.userLogin = userLogin;
    });
  }

  signOut() {
    this.authService.logoutUser().subscribe();
  }
}
