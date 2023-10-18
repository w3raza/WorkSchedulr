import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { User } from "src/app/shared/models/user.model";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  selectedRole: string = "all";
  showAddUserModal: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService
      .fetchUsers(true, this.currentPage - 1, this.selectedRole)
      .subscribe((data: any) => {
        this.users = data.content;
      });
  }

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
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

  // ... pozostały kod ...

  toggleUserStatus(user: User) {
    const newStatus = !user.status;
    console.log(newStatus);
    this.userService.toggleUserStatus(user.id).subscribe((response: User) => {
      user.status = response.status;
    });
  }
}
