import { Component } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { User } from "src/app/shared/models/user.model";
import { UserRole } from "src/app/shared/enums/user-role.enum";
import { MatDialog } from "@angular/material/dialog";
import { UserCreateComponent } from "../user-create/user-create.component";
import { PaginatorHelper } from "src/app/shared/services/paginator.service.ts";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent extends PaginatorHelper {
  roles: Array<string> = [...Object.keys(UserRole), "Default"];
  users: User[] = [];
  filterUserStatus: { value: boolean; viewValue: string }[] = [];
  selectedRole: string = "Default";
  selectedStatus: any = null;

  constructor(private userService: UserService, public dialog: MatDialog) {
    super();
    this.fetchUsers();
    this.filterUserStatus = this.initActiveStatus();
  }

  override fetchData() {
    this.fetchUsers();
  }

  initActiveStatus(): { value: any; viewValue: string }[] {
    return [
      { value: true, viewValue: "ENABLE" },
      { value: false, viewValue: "DISABLED" },
      { value: null, viewValue: "Default" },
    ];
  }

  fetchUsers() {
    this.userService
      .fetchUsers(
        this.selectedStatus,
        this.currentPage - 1,
        UserRole[this.selectedRole as keyof typeof UserRole]
      )
      .subscribe((data) => {
        this.users = [...data.content];
      });
  }

  openAddUserModal() {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log("reposne:" + response);
    });
  }

  toggleUserStatus(user: User) {
    this.userService.toggleUserStatus(user.id).subscribe((response) => {
      user.status = response.status;
    });
  }
}
