export class User {
  constructor(
    public username: string,
    private _token: string,
    private role: string
  ) {}

  get token() {
    return this._token;
  }
}
