import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { ValidatorsService } from "../../services/validators.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  user: User = new User("", "", "", "", "", "", "", false, false, []);
  isEditing = false;
  control: keyof User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private validatorsService: ValidatorsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.userService.currentUser$.subscribe((currentUser) => {
      if (currentUser && currentUser.id) {
        this.fetchUserData(currentUser.id);
      }
    });
  }

  fetchUserData(userId: string): void {
    this.userService.getUser(userId).subscribe((user) => {
      this.user = user;
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birth: user.birth,
        student: user.student,
        userRoles: user.userRoles[0],
      });
    });
  }

  createForm(): void {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      email: [
        null,
        [
          Validators.required,
          Validators.minLength(4),
          this.validatorsService.customEmailValidator,
        ],
      ],
      phone: [
        null,
        [Validators.required, this.validatorsService.phoneNumberValidator],
      ],
      birth: [null, Validators.required],
      student: [null, Validators.required],
      userRoles: [{ value: null, disabled: true }],
    });
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    this.normalizeStudentValue();
    this.userService
      .updateUser(this.user.id, this.userForm.value)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
        this.toggleEditing();
      });
  }

  private normalizeStudentValue(): void {
    this.userForm.value.student = !!this.userForm.value.student;
  }
}
