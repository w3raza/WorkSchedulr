import { UserRole } from "../enums/user-role.enum";
import { CalendarEvent } from "./calendar-event.model";
import { Project } from "./project.modal";

export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public phone: string,
    public birth: string,
    public student: boolean,
    public status: boolean,
    public userRoles: UserRole[],
    public projects: Project[],
    public calendarEvents: CalendarEvent[]
  ) {}
}
