import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../shared/models/user.model";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  user!: User;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.authService.user.value?.id;
    if (id != undefined) {
      this.fetchUserData(id);
    }
  }

  fetchUserData(userId: string): void {
    this.userService.getUser(userId).subscribe((user) => {
      this.user = user;
      this.fillForm();
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: [null, []],
      lastName: [null, []],
      email: [null, []],
      phone:[null, []],
      birth: [null, []],
      student: [null, []],
      userRoles: [{ value: null, disabled: true }, []],
    });
  }

  fillForm(): void {
    this.userForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone],
      birth: [this.user.birth],
      student: [this.user.student, []],
      userRoles: [
        {
          value: this.user?.userRoles[0],
          disabled: true,
        },
        [],
      ],
    });
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    this.userForm.value.student= this.userForm.value.student === 'true' || this.userForm.value.student === true
    this.userService
      .updateUser(this.user.id, this.userForm.value)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
        this.toggleEditing();
      });
  }
}
