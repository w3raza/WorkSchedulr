import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AbstractControl } from "@angular/forms";

import { AuthService } from "../shared/services/auth.service";

import { LoginResponse } from "../shared/models/loginResponse.model";

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
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(4)]],
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
      username: ["", [Validators.required, Validators.minLength(4)]],
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
      email: ["", [Validators.required, customEmailValidator]],
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      phone: ["", [Validators.required, phoneNumberValidator]],
      birth: ["", Validators.required],
    });

    // Synchronize values
    this.syncForms();
  }

  syncForms() {
    this.loginForm.get("username")?.valueChanges.subscribe((value) => {
      this.registerForm.get("username")?.setValue(value, { emitEvent: false });
    });

    this.loginForm.get("password")?.valueChanges.subscribe((value) => {
      this.registerForm.get("password")?.setValue(value, { emitEvent: false });
    });

    this.registerForm.get("username")?.valueChanges.subscribe((value) => {
      this.loginForm.get("username")?.setValue(value, { emitEvent: false });
    });

    this.registerForm.get("password")?.valueChanges.subscribe((value) => {
      this.loginForm.get("password")?.setValue(value, { emitEvent: false });
    });
  }

  get usernameControl() {
    return this.loginForm.get("username");
  }

  get passwordControl() {
    return this.loginForm.get("password");
  }

  get emailControl() {
    return this.registerForm.get("email");
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

  onBlurUseruame() {
    this.usernameControl?.markAsTouched();
  }

  onBlurPassword() {
    this.passwordControl?.markAsTouched();
  }

  onBlurEmail() {
    this.emailControl?.markAsTouched();
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
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
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
