import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AbstractControl } from "@angular/forms";

import { AuthService } from "../shared/services/auth.service";

import { LoginResponse } from "../shared/models/loginResponse.model";
import { NotificationService } from "../shared/services/notification.service";

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
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: [
        "",
        [Validators.required, Validators.minLength(4), customEmailValidator],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          caseValidator,
          numberValidator,
          specialCharacterValidator,
        ],
      ],
    });

    this.registerForm = this.fb.group({
      email: [
        "",
        [Validators.required, Validators.minLength(4), customEmailValidator],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          caseValidator,
          numberValidator,
          specialCharacterValidator,
        ],
      ],
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      phone: ["", [Validators.required, phoneNumberValidator]],
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

function caseValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const value: string = control.value;
  if (value && (!/[a-z]/.test(value) || !/[A-Z]/.test(value))) {
    return { caseRequirement: { value } };
  }
  return null;
}

function numberValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const value: string = control.value;
  if (value && !/\d/.test(value)) {
    return { numberRequirement: { value } };
  }
  return null;
}

function specialCharacterValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const value: string = control.value;
  const specialChars = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (value && !specialChars.test(value)) {
    return { specialCharRequirement: { value } };
  }
  return null;
}

function customEmailValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const value: string = control.value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (value && !emailPattern.test(control.value)) {
    return { invalidEmail: { value } };
  }
  return null;
}

function phoneNumberValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const value: string = control.value;
  const phonePattern = /^\d{9}$/;

  if (value && !phonePattern.test(control.value)) {
    return { invalidPhoneNumber: { value } };
  }
  return null;
}
