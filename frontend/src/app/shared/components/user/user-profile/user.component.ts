import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { User } from "../../../models/user.model";
import { UserService } from "../../../services/user.service";
import { ValidatorsService } from "../../../services/validators.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { FormOfContract } from "src/app/shared/enums/formOfContract.enum";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent {
  formOfContracts: string[] = Object.values(FormOfContract);
  formOfContract: typeof FormOfContract = FormOfContract;

  userForm!: FormGroup;
  user!: User;
  isEditing = false;
  control: keyof User | null = null;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private validatorsService: ValidatorsService
  ) {
    this.createForm();
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.userId = params.get("id");
          if (this.userId && this.userId != "null") {
            return this.userService.getUser(this.userId);
          } else {
            return this.userService.getCurrentUser();
          }
        })
      )
      .subscribe((user) => {
        if (user) {
          this.fetchUserData(user);
        }
      });
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
      formOfContract: user.formOfContract,
      hourlyRate: user.hourlyRate,
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
      formOfContract: [null],
      hourlyRate: [0],
    });
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    this.normalizeStudentValue();
    const formValue = {
      ...this.userForm.value,
      formOfContract: this.getFormOfContractValue(),
    };
    this.userService
      .updateUser(this.user.id, formValue)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
        this.toggleEditing();
      });
  }

  private normalizeStudentValue(): void {
    this.userForm.value.student = !!this.userForm.value.student;
  }

  getFormOfContractValue(): string {
    return Object.keys(this.formOfContract)[
      Object.values(this.formOfContract).indexOf(
        this.userForm.value.formOfContract
      )
    ];
  }
}
