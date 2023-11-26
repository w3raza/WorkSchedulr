import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../../../models/user.model";
import { UserService } from "../../../services/user.service";
import { ValidatorsService } from "../../../services/validators.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent {
  userForm!: FormGroup;
  user: User = new User("", "", "", "", "", "", "", false, false, [], [], []);
  isEditing = false;
  control: keyof User | null = null;
  userId!: string | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private validatorsService: ValidatorsService
  ) {
    this.createForm();
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get("id");
    });
    this.fetchUser();
  }

  fetchUser() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((user) => {
        if (user) {
          this.fetchUserData(user);
        }
      });
    } else {
      this.userService.getCurrentUser().subscribe((currentUser) => {
        if (currentUser) {
          this.fetchUserData(currentUser);
        }
      });
    }
  }

  fetchUserData(user: User): void {
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
