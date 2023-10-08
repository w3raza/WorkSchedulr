import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle!: string;
  @Input() logoSrc!: string;

  userLogin: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userLogin$.subscribe((userLogin) => {
      this.userLogin = userLogin;
    });
  }

  redirectToHome() {
    this.router.navigateByUrl("/home");
  }

  redirectToCalendar() {
    this.router.navigateByUrl("/calendar");
  }

  redirectToBills() {
    this.router.navigateByUrl("/bills");
  }

  redirectToProjects() {
    this.router.navigateByUrl("/projects");
  }

  redirectToEmployees() {
    this.router.navigateByUrl("/employees");
  }

  redirectToUser() {
    this.router.navigateByUrl("/user");
  }

  signOut() {
    this.authService.logoutUser().subscribe();
  }
}
