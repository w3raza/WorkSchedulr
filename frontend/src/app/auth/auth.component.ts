import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";

import { AuthService } from "../shared/services/auth.service";

import { LoginResponse } from "../shared/models/loginResponse.model";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  active: string = "login";

  onLoginTab(): void {
    this.active = "login";
  }

  onRegisterTab(): void {
    this.active = "register";
  }

  form = this.fb.group(
    this.active === "login"
      ? {
          username: ["", [Validators.required, Validators.minLength(4)]],
          password: ["", [Validators.required, Validators.minLength(8)]],
        }
      : {
          username: ["", [Validators.required, Validators.minLength(4)]],
          password: ["", [Validators.required, Validators.minLength(8)]],
          email: ["", Validators.required],
        }
  );

  login() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    this.authService.loginUser(username, password).subscribe({
      next: (response: LoginResponse) => {
        this.authService.setAuthToken(response.token);
        this.router.navigateByUrl("/home");
      },
      error: (error) => {
        this.authService.setAuthToken(null);
        alert(error.message);
      },
    });
  }

  register() {}
}
