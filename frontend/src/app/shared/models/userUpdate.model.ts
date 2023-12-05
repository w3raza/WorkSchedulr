import { FormOfContract } from "../enums/formOfContract.enum";

export class UserUpdate {
  constructor(
    public password: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public birth: string,
    public student: boolean,
    public formOfContract: FormOfContract,
    public hourlyRate: number
  ) {}
}
