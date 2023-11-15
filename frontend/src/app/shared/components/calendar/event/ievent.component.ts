import { EventEmitter } from "@angular/core";

export interface IEventComponent {
  // Define the events that your modal components must have
  close: EventEmitter<void>;
  submit: EventEmitter<any>; // Replace 'any' with the specific type of data you expect to emit on submission
}
