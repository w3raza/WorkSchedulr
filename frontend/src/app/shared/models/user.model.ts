import { UserRole } from "../enums/user-role.enum";

export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public birth: string,
    public student: boolean,
    public userRoles: UserRole[]
  ) {}
}
