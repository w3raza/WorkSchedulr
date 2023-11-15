import { Component, Output, EventEmitter } from "@angular/core";
import { IEventComponent } from "./ievent.component";

@Component({
  selector: "app-modal",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"],
})
export class EventComponent implements IEventComponent {
  taskDescription: string = "";
  selectedProject: string = "";
  selectedType: string = "";
  issueTracker: string = "";

  // Implement the interface properties
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>(); // Again, replace 'any' with your data type

  // Other component properties and methods

  // Method to close the modal
  onCancel() {
    this.close.emit();
  }

  // Method to submit the modal's data
  onSubmit() {
    // Here, we would gather all the form data into an object
    const eventData = {
      description: this.taskDescription,
      project: this.selectedProject,
      type: this.selectedType,
      // ... any other data fields
    };
    // Emit the task data to the parent component
    this.submit.emit(eventData);
    // Close the modal
    this.onCancel();
  }
}
