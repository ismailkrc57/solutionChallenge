export class AuthModel {
  constructor(
    public username: string,
    private _access_token: string,
    private _refresh_token: string,
    private _expirationDate: Date
  ) {
  }

  get token() {
    if (!this._expirationDate || new Date() > this._expirationDate)
      return null;
    return this._access_token
  }
}
