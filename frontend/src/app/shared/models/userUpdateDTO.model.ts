export class UserUpdateDTO {
  constructor(
    public password: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public birth: string,
    public student: boolean
  ) {}
}
