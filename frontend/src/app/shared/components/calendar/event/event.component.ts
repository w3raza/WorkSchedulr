import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"],
})
export class EventComponent {
  taskDescription: string = "";
  selectedProject: string = "";

  constructor(public dialogRef: MatDialogRef<EventComponent>) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const eventData = {
      description: this.taskDescription,
      project: this.selectedProject,
    };
    this.dialogRef.close(eventData);
    this.onCancel();
  }
}
