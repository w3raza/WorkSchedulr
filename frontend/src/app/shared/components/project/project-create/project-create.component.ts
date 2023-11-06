import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IdNameDTO } from "src/app/shared/models/IdNameDTO.modal";
import { Project } from "src/app/shared/models/project.modal";
import { User } from "src/app/shared/models/user.model";
import { NotificationService } from "src/app/shared/services/notification.service";
import { ProjectService } from "src/app/shared/services/project.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
  selector: "app-project-create",
  templateUrl: "./project-create.component.html",
  styleUrls: ["./project-create.component.css"],
})
export class ProjectCreateComponent {
  owners: Array<IdNameDTO> = [];

  createForm: FormGroup = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(2)]],
    hours: [null],
    status: [false],
    owner: [User],
    managers: [User],
    users: [User],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private notification: NotificationService
  ) {
    this.setOwners();
  }

  getControl(name: string) {
    return this.createForm.get(name);
  }

  onBlur(controlName: string) {
    this.getControl(controlName)?.markAsTouched();
  }

  setOwners() {
    this.userService.getAllUser().subscribe((users: User[]) => {
      const transformedUsers = this.transformUsersToAssigments(users);
      this.owners = transformedUsers;
    });
  }

  transformUsersToAssigments(users: User[]): IdNameDTO[] {
    return users.map((user) => ({
      ...user,
      name: this.getFullNameForm(user.firstName, user.lastName),
    }));
  }

  getFullNameForm(name: string, surname: string): string {
    return `${name} ${surname}`;
  }

  createProject() {
    const { title, hours, status, owner, managers, users } =
      this.createForm.value;
    const project = new Project(
      "",
      title,
      hours,
      [0],
      status,
      owner,
      managers,
      users
    );
    // this.projectService.createProject(project).subscribe((createdProject) => {
    //   if (createdProject) {
    //     this.notification.showSuccess("Project created");
    //   }
    // });
  }
}
