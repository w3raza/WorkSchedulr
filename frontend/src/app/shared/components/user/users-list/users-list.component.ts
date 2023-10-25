import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { User } from "src/app/shared/models/user.model";
import { PageEvent } from "@angular/material/paginator";
import { UserRole } from "src/app/shared/enums/user-role.enum";
import { MatDialog } from "@angular/material/dialog";
import { UserCreateComponent } from "../user-create/user-create.component";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  roles: Array<string> = [...Object.keys(UserRole), "Default"];
  users: User[] = [];
  filterUserStatus: { value: boolean; viewValue: string }[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  selectedRole: string = "Default";
  selectedStatus: any = null;

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.filterUserStatus = this.initActiveStatus();
  }

  initActiveStatus(): { value: any; viewValue: string }[] {
    return [
      { value: true, viewValue: "ENABLE" },
      { value: false, viewValue: "DISABLED" },
      { value: null, viewValue: "Default" },
    ];
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchUsers();
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
      width: "250px",
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  nextPage() {
    this.currentPage++;
    this.fetchUsers();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers();
    }
  }

  toggleUserStatus(user: User) {
    this.userService.toggleUserStatus(user.id).subscribe((response) => {
      user.status = response.status;
    });
  }
}
