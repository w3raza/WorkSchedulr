import { Component, OnInit } from "@angular/core";
import { Project } from "../../models/project.modal";
import { ProjectService } from "../../services/project.service";
import { MatDialog } from "@angular/material/dialog";
import { UserCreateComponent } from "../user/user-create/user-create.component";
import { UserRole } from "../../enums/user-role.enum";
import { ProjectCreateComponent } from "./project-create/project-create.component";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  role: typeof UserRole = UserRole;

  colors: string[] = [
    "rgba(92,41,0,0.2)",
    "rgba(0,37,92,0.2)",
    "rgba(2,92,0.3,0.2)",
    "rgba(63, 92, 0,0.2)",
    "rgba(0, 70, 92,0.2)",
    "rgba(92, 0, 83,0.2)",
    "rgba(92, 0, 0,0.2)",
  ];

  buttonsColor: string[] = [
    "rgba(92,41,0,0.5)",
    "rgba(0,37,92,0.5)",
    "rgba(2,92,0.3,0.5)",
    "rgba(63, 92, 0,0.5)",
    "rgba(0, 70, 92,0.5)",
    "rgba(92, 0, 83,0.5)",
    "rgba(92, 0, 0,0.5)",
  ];

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectService.fetchProjects().subscribe((data) => {
      this.projects = [...data.content];
    });
  }

  getBackgroundColor(index: number) {
    return {
      "background-color": `${this.colors[index % (this.colors.length - 1)]}`,
    };
  }

  getButtonColor(index: number) {
    return {
      "background-color": `${
        this.buttonsColor[index % (this.buttonsColor.length - 1)]
      }`,
    };
  }

  openAddUserModal() {
    const dialogRef = this.dialog.open(ProjectCreateComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((response) => {
      console.log("reposne:" + response);
    });
  }
}
