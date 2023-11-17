import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AuthHelper } from "src/app/shared/helper/auth.helper";
import { Project } from "src/app/shared/models/project.modal";
import { ProjectService } from "src/app/shared/services/project.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"],
})
export class EventComponent {
  taskDescription: string = "";
  selectedProject!: Project;

  projects: Project[] = [];
  userId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EventComponent>,
    private authHelper: AuthHelper,
    private projectService: ProjectService
  ) {
    if (!this.authHelper.checkIsAdmin()) {
      this.userId = this.authHelper.getCurrentUserId();
    }
    this.getAllProjectsForUser();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const eventData = {
      description: this.taskDescription,
      project: this.selectedProject,
    };
    console.log("eventData before closing dialog:", eventData);
    this.dialogRef.close(eventData);
  }

  private getAllProjectsForUser(): void {
    this.projectService
      .fetchProjects(this.userId, null, null, 0)
      .subscribe((data) => {
        this.projects = [...data.content];
      });
  }
}
