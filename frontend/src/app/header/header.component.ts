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
    this.userLogin = JSON.parse(window.localStorage.getItem("user") || "{}");
  }

  redirectToHome() {
    this.router.navigateByUrl("/home");
  }

  redirectToBills() {
    this.router.navigateByUrl("/bills");
  }

  signOut() {
    this.authService.logoutUser().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }
}
