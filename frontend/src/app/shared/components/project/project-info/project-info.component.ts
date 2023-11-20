import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UserRole } from "src/app/shared/enums/user-role.enum";
import { Project } from "src/app/shared/models/project.modal";
import { ProjectDataService } from "src/app/shared/services/projec.data.service";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";
import { ProjectService } from "src/app/shared/services/project.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { MatDatepicker } from "@angular/material/datepicker";
import { IdNameDTO } from "src/app/shared/models/IdNameDTO.modal";
import { UserService } from "src/app/shared/services/user.service";
import { User } from "src/app/shared/models/user.model";
import { UserHelper } from "src/app/shared/helper/user.helper";

@Component({
  selector: "app-project-info",
  templateUrl: "./project-info.component.html",
  styleUrls: ["./project-info.component.css"],
})
export class ProjectInfoComponent {
  role: typeof UserRole = UserRole;

  project!: Project;

  editMode = false;

  projectForm: FormGroup;

  users: Array<IdNameDTO> = [];

  @ViewChild("picker")
  picker!: MatDatepicker<Date>;

  constructor(
    private projectDataService: ProjectDataService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private userService: UserService,
    private notification: NotificationService
  ) {
    this.projectDataService.currentProject.subscribe((project) => {
      if (project) {
        this.project = project;
      }
    });

    this.projectForm = this.fb.group({
      title: ["", Validators.required],
      hours: [""],
      createdDate: [""],
      status: [""],
      owner: [null],
      managers: [null],
      users: [null],
    });

    this.setUsers();
  }

  get form() {
    return this.projectForm.controls;
  }

  setUsers() {
    this.userService.getAllUser().subscribe((users: User[]) => {
      const transformedUsers = UserHelper.transformUsersToAssigments(users);
      this.users = transformedUsers;
    });
  }

  backToList(): void {
    this.router.navigate(["/projects"]);
  }

  editProject(): void {
    this.editMode = true;
    this.projectForm.patchValue({
      title: this.project.title,
      hours: this.project.hours,
      createdDate: this.getCreatedDate(),
      status: this.project.status,
      owner: this.project.owner,
      managers: this.project.managers,
      users: this.project.users,
    });
  }

  saveProject(): void {
    if (this.projectForm.valid) {
      const { title, hours, status, owner, managers, users } =
        this.projectForm.value;
      const project = new Project(
        this.project.id,
        title,
        hours,
        [],
        status,
        owner,
        managers,
        users
      );
      this.projectService.updateProject(project).subscribe((updatedProject) => {
        this.project = updatedProject;
        this.editMode = false;
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  deleteProject(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.deleteProject(id).subscribe((note) => {
          if (note) {
            this.notification.showSuccess(note);
            this.backToList();
          }
        });
      }
    });
  }

  getCreatedDate(): Date {
    if (this.project && this.project.createdDate) {
      const [year, month, day] = this.project.createdDate;
      return new Date(year, month - 1, day);
    }
    return new Date();
  }
}
