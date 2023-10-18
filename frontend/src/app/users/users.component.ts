import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { UserService } from "../user/user.service";
import { UserRole } from "../shared/enums/user-role.enum";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent {
  roles: Array<string> = Object.keys(UserRole);
  filterUserStatus: { value: boolean; viewValue: string }[] = [
    { value: true, viewValue: "Active" },
    { value: false, viewValue: "Disactive" },
  ];

  usersForm!: FormGroup;
  role: typeof UserRole = UserRole;

  constructor(private userService: UserService) {}

  onSubmit(): void {
    const choosenRole = this.usersForm.value.role;
    const choosenStatus = this.usersForm.value.status;

    if (choosenRole === "All roles") {
      //this.fetchUsers(choosenStatus);
    }
  }

  // fetchUsers(status: boolean = true, page: number = 0,  selectedRole: string): void {
  //   this.userService.fetchUsers(status, page, selectedRole).subscribe();
  // }

  createUser(): void {}
}
