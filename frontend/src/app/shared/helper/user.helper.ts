import { IdName } from "../models/idName.modal";
import { User } from "../models/user.model";

export class UserHelper {
  static findKeyForValue(
    object: Record<string, any>,
    value: string
  ): string | null {
    const foundKey = Object.keys(object).find((key) => object[key] === value);
    return foundKey ?? null;
  }

  static transformUsersToAssignments(users: User[]): IdName[] {
    return users.map((user) => ({
      ...user,
      name: this.getFullNameForm(user.firstName, user.lastName),
    }));
  }

  static getFullNameForm(name: string, surname: string): string {
    return `${name} ${surname}`;
  }

  static findUserNameById(userIdNames: IdName[], id: string): string {
    const user = userIdNames.find((userDto) => userDto.id === id);
    return user ? user.name : "";
  }
}
