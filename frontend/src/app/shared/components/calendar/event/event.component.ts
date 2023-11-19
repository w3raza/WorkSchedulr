import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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

  constructor(
    public dialogRef: MatDialogRef<EventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projects: Project[] }
  ) {
    this.projects = data.projects;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const eventData = {
      description: this.taskDescription,
      project: this.selectedProject,
    };
    this.dialogRef.close(eventData);
  }
}
