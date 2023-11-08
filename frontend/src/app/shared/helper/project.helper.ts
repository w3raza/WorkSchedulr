import { IdNameDTO } from "../models/IdNameDTO.modal";
import { User } from "../models/user.model";

export class ProjectHelper {
  static transformUsersToAssigments(users: User[]): IdNameDTO[] {
    return users.map((user) => ({
      ...user,
      name: this.getFullNameForm(user.firstName, user.lastName),
    }));
  }

  static getFullNameForm(name: string, surname: string): string {
    return `${name} ${surname}`;
  }
}
