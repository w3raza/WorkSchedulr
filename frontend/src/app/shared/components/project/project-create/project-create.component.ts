import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { UserHelper } from "src/app/shared/helper/user.helper";
import { IdNameDTO } from "src/app/shared/models/IdNameDTO.modal";
import { Project } from "src/app/shared/models/project.modal";
import { User } from "src/app/shared/models/user.model";
import { ProjectService } from "src/app/shared/services/project.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-project-create",
  templateUrl: "./project-create.component.html",
  styleUrls: ["./project-create.component.css"],
})
export class ProjectCreateComponent {
  users: Array<IdNameDTO> = [];

  createForm: FormGroup = this.fb.group({
    title: [null, [Validators.required, Validators.minLength(2)]],
    hours: [null],
    status: [false],
    owner: [null],
    managers: [null],
    users: [null],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<ProjectCreateComponent>
  ) {
    this.setUsers();
  }

  getControl(name: string) {
    return this.createForm.get(name);
  }

  onBlur(controlName: string) {
    this.getControl(controlName)?.markAsTouched();
  }

  setUsers() {
    this.userService.getAllUser().subscribe((users: User[]) => {
      const transformedUsers = UserHelper.transformUsersToAssigments(users);
      this.users = transformedUsers;
    });
  }

  createProject() {
    const { title, hours, status, owner, managers, users } =
      this.createForm.value;
    const project = new Project(
      "",
      title,
      hours,
      [],
      status,
      owner,
      managers,
      users
    );
    this.projectService.createProject(project).subscribe((createdProject) => {
      this.dialogRef.close(createdProject);
    });
  }
}
