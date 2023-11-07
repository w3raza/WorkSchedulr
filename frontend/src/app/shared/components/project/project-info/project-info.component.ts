import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserRole } from "src/app/shared/enums/user-role.enum";
import { Project } from "src/app/shared/models/project.modal";
import { ProjectDataService } from "src/app/shared/services/projec.data.service";

@Component({
  selector: "app-project-info",
  templateUrl: "./project-info.component.html",
  styleUrls: ["./project-info.component.css"],
})
export class ProjectInfoComponent {
  role: typeof UserRole = UserRole;

  project!: Project;

  constructor(
    private projectDataService: ProjectDataService,
    private router: Router
  ) {
    this.projectDataService.currentProject.subscribe((project) => {
      if (project) {
        this.project = project;
      }
    });
  }

  backToList(): void {
    this.router.navigate(["/projects"]);
  }

  editProject(): void {
    console.log("Edit");
  }

  deleteProject(): void {
    console.log("Delete");
    this.backToList();
  }

  getCreatedDate(): Date {
    if (this.project && this.project.createdDate) {
      const [year, month, day] = this.project.createdDate;
      return new Date(year, month - 1, day);
    }
    return new Date();
  }
}
