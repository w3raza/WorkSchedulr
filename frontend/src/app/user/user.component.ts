import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../shared/models/user.model";
import { UserService } from "../shared/services/user.service";
import { ValidatorsService } from "../shared/services/validators.service";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  user: User = null!;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private validatorsService: ValidatorsService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
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
  }

  ngOnInit(): void {
    const id = this.authService.user.value?.id;
    if (id != undefined) {
      this.fetchUserData(id);
    }
  }

  fetchUserData(userId: string): void {
    this.userService.getUser(userId).subscribe((user) => {
      this.user = user;
      this.initForm();
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstname: [this.user.firstName, Validators.required],
      lastname: [this.user.lastName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone],
      birth: [this.user.birth],
      address: [this.user.address],
      roles: [this.user.roles],
    });
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    this.userService
      .updateUser(this.user.id, this.userForm.value)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
        this.toggleEditing();
      });
  }
}
