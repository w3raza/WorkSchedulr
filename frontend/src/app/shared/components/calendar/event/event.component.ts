import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthHelper } from "src/app/shared/helper/auth.helper";
import { CalendarEvent } from "src/app/shared/models/calendar-event.model";
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
  existingEventId?: string;

  projects: Project[] = [];
  projectNameInfo: string = ", ProjectName: ";

  constructor(
    public dialogRef: MatDialogRef<EventComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { projects: Project[]; event?: CalendarEvent }
  ) {
    this.projects = data.projects;
    if (data.event) {
      this.existingEventId = data.event.id;
      this.taskDescription = data.event.title.split(this.projectNameInfo)[0]; // Extracting the original title
      this.selectedProject = data.event.project;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const eventData = {
      id: this.existingEventId,
      description: this.taskDescription,
      project: this.selectedProject,
    };
    this.dialogRef.close(eventData);
  }

  onDelete() {
    this.dialogRef.close({ delete: true, id: this.existingEventId });
  }
}
