import { User } from "./user.model";

export class Project {
  constructor(
    public id: string,
    public title: string,
    public hours: number,
    public createdDate: number[],
    public status: boolean,
    public owner: User,
    public managers: User[],
    public users: User[]
  ) {}
}
