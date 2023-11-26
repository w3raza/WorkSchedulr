import { Project } from "./project.modal";
import { User } from "./user.model";

export class CalendarEvent {
  constructor(
    public id: string,
    public title: string,
    public start: Date,
    public end: Date,
    public project: Project,
    public user: User
  ) {}
}
