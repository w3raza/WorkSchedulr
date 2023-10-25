import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/shared/services/auth.service";
import { UserRole } from "src/app/shared/enums/user-role.enum";
import { ValidatorsService } from "src/app/shared/services/validators.service";
import { UserService } from "../../../services/user.service";
import { User } from "src/app/shared/models/user.model";

@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent {
  roles: Array<string> = [...Object.keys(UserRole)];

  createForm: FormGroup = this.fb.group({
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
    student: [false],
    role: [UserRole.USER],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private validatorsService: ValidatorsService
  ) {}

  getControl(name: string) {
    return this.createForm.get(name);
  }

  onBlur(controlName: string) {
    this.getControl(controlName)?.markAsTouched();
  }

  create() {
    console.log("Halo");
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      birth,
      student,
      role,
    } = this.createForm.value;
    const user = new User(
      "",
      firstName,
      lastName,
      email,
      password,
      phone,
      birth,
      student,
      false,
      role
    );
    console.log(user);
    this.userService.createUser(user);
  }
}
