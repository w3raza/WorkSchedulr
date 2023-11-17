import { Project } from "./project.modal";
import { User } from "./user.model";

export class CalendarEvent {
  constructor(
    public id: string,
    public description: string,
    public startTime: string,
    public endTime: string,
    public project: Project,
    public user: User
  ) {}
}
