import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validatorsService: ValidatorsService
  ) {
    this.createForm = this.fb.group({
      email: ["", [
        Validators.required,
        Validators.minLength(4),
        this.validatorsService.customEmailValidator
      ]],
      password: ["", [
        Validators.required,
        Validators.minLength(8),
        this.validatorsService.caseValidator,
        this.validatorsService.numberValidator,
        this.validatorsService.specialCharacterValidator
      ]],
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      phone: ["", [Validators.required, this.validatorsService.phoneNumberValidator]],
      birth: ["", Validators.required]
    });
  }

  getControl(name: string) {
    return this.createForm.get(name);
  }

  onBlur(controlName: string) {
    this.getControl(controlName)?.markAsTouched();
  }

  create() {
    const { email, password, firstName, lastName, phone, birth } = this.createForm.value;
    this.authService.registerUser(email, password, firstName, lastName, phone, birth);
  }
}
