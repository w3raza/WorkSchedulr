import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../shared/models/user.model";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { ValidatorsService } from "../shared/services/validators.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  user: User = new User(
    "", // id
    "", // firstName
    "", // lastName
    "", // email
    "", // phone
    "", // birth
    false, // student
    false, // status
    [] // userRoles
  );
  isEditing = false;
  control: keyof User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private validatorsService: ValidatorsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    const userId = this.authService.user.value?.id;
    if (userId) {
      this.fetchUserData(userId);
    }
  }

  /**
   * Fetches user data based on ID.
   * @param userId - ID of the user.
   */
  fetchUserData(userId: string): void {
    this.userService.getUser(userId).subscribe((user) => {
      this.user = user;
      this.updateFormValues();
    });
  }

  /**
   * Initializes or updates the form.
   * @param isUpdate - If true, updates the form with user data.
   */
  createForm(isUpdate: boolean = false): void {
    const controls = {
      firstName: [
        isUpdate ? this.user.firstName : null,
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        isUpdate ? this.user.lastName : null,
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        isUpdate ? this.user.email : null,
        [
          Validators.required,
          Validators.minLength(4),
          this.validatorsService.customEmailValidator,
        ],
      ],
      phone: [
        isUpdate ? this.user.phone : null,
        [Validators.required, this.validatorsService.phoneNumberValidator],
      ],
      birth: [isUpdate ? this.user.birth : null, Validators.required],
      student: [isUpdate ? this.user.student : null, Validators.required],
      userRoles: [
        {
          value: isUpdate ? this.user?.userRoles[0] : null,
          disabled: true,
        },
      ],
    };
    this.userForm = this.fb.group(controls);
  }

  /**
   * Updates form values based on fetched user data.
   */
  updateFormValues(): void {
    this.createForm(true);
  }

  /**
   * Toggles the editing state.
   */
  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  /**
   * Handles form submission.
   */
  onSubmit(): void {
    this.normalizeStudentValue();
    this.userService
      .updateUser(this.user.id, this.userForm.value)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
        this.toggleEditing();
      });
  }

  /**
   * Normalizes the student value.
   */
  private normalizeStudentValue(): void {
    const TRUE_STRING = "true";
    this.userForm.value.student =
      this.userForm.value.student === TRUE_STRING ||
      this.userForm.value.student === true;
  }
}
