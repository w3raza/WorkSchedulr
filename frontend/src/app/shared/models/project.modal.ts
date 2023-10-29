import { User } from "./user.model";

export class Project {
  constructor(
    public id: string,
    public title: string,
    public hours: number,
    public createdDate: Date,
    public status: boolean,
    public owner: User,
    public managers: User[],
    public users: User[]
  ) {}
}
