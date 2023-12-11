import { FormOfContract } from "../enums/formOfContract.enum";
import { UserRole } from "../enums/userRole.enum";
import { CalendarEvent } from "./calendarEvent.model";
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
    public calendarEvents: CalendarEvent[],
    public formOfContract: FormOfContract,
    public hourlyRate: number
  ) {}
}
