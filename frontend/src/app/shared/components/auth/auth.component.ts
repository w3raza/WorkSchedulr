import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../../services/auth.service";
import { ValidatorsService } from "../../services/validators.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  active: "login" | "register" = "login";

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
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

  onBlur(fieldName: string) {
    if (fieldName === "email") {
      this.emailControl?.markAsTouched();
    } else if (fieldName === "password") {
      this.passwordControl?.markAsTouched();
    } else if (fieldName === "firstName") {
      this.firstNameControl?.markAsTouched();
    } else if (fieldName === "lastName") {
      this.lastNameControl?.markAsTouched();
    } else if (fieldName === "phone") {
      this.phoneControl?.markAsTouched();
    }
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

  onLoginTab() {
    this.active = "login";
  }

  onRegisterTab() {
    this.active = "register";
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.loginUser(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl("/home");
        },
        error: () => {
          this.authService.setAuthToken(null);
        },
      });
    }
  }

  register() {
    if (this.registerForm.valid) {
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
          error: () => {
            this.authService.setAuthToken(null);
          },
        });
    }
  }

  getControlErrors(fieldName: string): string[] {
    let control;
    if (this.active === "login") {
      control = this.loginForm.get(fieldName);
    } else {
      control = this.registerForm.get(fieldName);
    }

    const errors = [];
    if (control && control.touched && control.errors) {
      if (control.errors["required"]) {
        errors.push(
          `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required.`
        );
      }
      if (control.errors["minlength"]) {
        errors.push(
          `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } must be at least ${
            control.errors["minlength"].requiredLength
          } characters.`
        );
      }
    }

    return errors;
  }

  getFieldType(field: string): string {
    switch (field) {
      case "email":
        return "email";
      case "password":
        return "password";
      default:
        return "text";
    }
  }
}
