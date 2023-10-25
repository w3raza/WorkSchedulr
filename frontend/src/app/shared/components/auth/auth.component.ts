import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../services/notification.service";
import { ValidatorsService } from "../../services/validators.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  active: string = "login";

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private validatorsService: ValidatorsService
  ) {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          this.validatorsService.customEmailValidator,
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          this.validatorsService.caseValidator,
          this.validatorsService.numberValidator,
          this.validatorsService.specialCharacterValidator,
        ],
      ],
    });

    this.registerForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          this.validatorsService.customEmailValidator,
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          this.validatorsService.caseValidator,
          this.validatorsService.numberValidator,
          this.validatorsService.specialCharacterValidator,
        ],
      ],
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      phone: [
        "",
        [Validators.required, this.validatorsService.phoneNumberValidator],
      ],
      birth: ["", Validators.required],
    });

    // Synchronize values
    this.syncForms();
  }

  syncForms() {
    this.loginForm.get("email")?.valueChanges.subscribe((value) => {
      this.registerForm.get("email")?.setValue(value, { emitEvent: false });
    });

    this.loginForm.get("password")?.valueChanges.subscribe((value) => {
      this.registerForm.get("password")?.setValue(value, { emitEvent: false });
    });

    this.registerForm.get("email")?.valueChanges.subscribe((value) => {
      this.loginForm.get("email")?.setValue(value, { emitEvent: false });
    });

    this.registerForm.get("password")?.valueChanges.subscribe((value) => {
      this.loginForm.get("password")?.setValue(value, { emitEvent: false });
    });
  }

  get emailControl() {
    return this.registerForm.get("email");
  }

  get passwordControl() {
    return this.loginForm.get("password");
  }

  get firstNameControl() {
    return this.registerForm.get("firstName");
  }

  get lastNameControl() {
    return this.registerForm.get("lastName");
  }

  get phoneControl() {
    return this.registerForm.get("phone");
  }

  onBlurEmail() {
    this.emailControl?.markAsTouched();
  }

  onBlurPassword() {
    this.passwordControl?.markAsTouched();
  }

  onBlurFirstName() {
    this.firstNameControl?.markAsTouched();
  }

  onBlurLastName() {
    this.lastNameControl?.markAsTouched();
  }

  onBlurPhone() {
    this.phoneControl?.markAsTouched();
  }

  onLoginTab() {
    this.active = "login";
  }

  onRegisterTab() {
    this.active = "register";
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.authService.loginUser(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl("/home");
      },
      error: (error) => {
        this.authService.setAuthToken(null);
        this.notificationService.showError(error.message);
      },
    });
  }

  register() {
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const firstName = this.registerForm.value.firstName;
    const lastName = this.registerForm.value.lastName;
    const phone = this.registerForm.value.phone;
    const birth = this.registerForm.value.birth;
    this.authService
      .registerUser(email, password, firstName, lastName, phone, birth)
      .subscribe({
        next: () => {
          this.router.navigateByUrl("/home");
        },
        error: (error) => {
          this.authService.setAuthToken(null);
          this.notificationService.showError(error.message);
        },
      });
  }
}
