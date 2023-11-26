import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRole } from "src/app/shared/enums/user-role.enum";
import { ValidatorsService } from "src/app/shared/services/validators.service";
import { UserService } from "../../../services/user.service";
import { User } from "src/app/shared/models/user.model";
import { MatDialogRef } from "@angular/material/dialog";

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
    private validatorsService: ValidatorsService,
    public dialogRef: MatDialogRef<UserCreateComponent>
  ) {}

  getControl(name: string) {
    return this.createForm.get(name);
  }

  onBlur(controlName: string) {
    this.getControl(controlName)?.markAsTouched();
  }

  createUser() {
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
      [UserRole[role as keyof typeof UserRole]],
      [],
      []
    );
    this.userService.createUser(user).subscribe((createdUser) => {
      console.log(createdUser);
      this.dialogRef.close(user);
    });
  }
}
