import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LoginModel} from "../models/auth_models/loginModel";
import {SingleResponseModel} from "../models/base_models/singleResponseModel";
import {TokenModel} from "../models/tokenModel";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RegisterModel} from "../models/auth_models/registerModel";
import {ResponseModel} from "../models/base_models/responseModel";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthModel} from "../models/auth-model";
import {Router} from "@angular/router";
import {ListResponseModel} from "../models/base_models/listResponseModel";
import {RoleModel} from "../models/role-model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged: BehaviorSubject<boolean>;
  authModel = new BehaviorSubject<AuthModel>(null)
  roleModel = new BehaviorSubject<RoleModel[]>(null)
  public username: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private expirationTimer: any;

  private jwtHelper: JwtHelperService = new JwtHelperService()

  constructor(private http: HttpClient, private route: Router) {
    this.isLogged = new BehaviorSubject<boolean>(false)
  }

  login(model: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    let body = new URLSearchParams();
    body.set('username', model.username);
    body.set('password', model.password);
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post<SingleResponseModel<TokenModel>>(environment.apiUrl + 'login', body.toString(), {
      headers,
      observe: 'body'
    }).pipe(tap(res => {
      const authModel = new AuthModel(model.username, res.data.access_token, res.data.refresh_token, this.jwtHelper.getTokenExpirationDate(res.data.access_token));
      this.authModel.next(authModel);
      this.username.next(authModel.username)
      this.autoLogout(this.jwtHelper.getTokenExpirationDate(res.data.access_token).getTime() - new Date().getTime())
      localStorage.setItem("tokenData", JSON.stringify(authModel))
      this.getRolesOfUser(authModel.username).subscribe({
        next: res => {
          this.roleModel.next(res.data)
        }
      })
    }));
  }

  register(model: RegisterModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + 'register', model);
  }

  autoLogin() {
    const tokenData: {
      username: string,
      _access_token: string;
      _refresh_token: string;
      _expirationDate: string
    } = JSON.parse(localStorage.getItem('tokenData'))
    if (!tokenData) {
      return;
    }
    const loadedAuthModel = new AuthModel(tokenData.username, tokenData._access_token, tokenData._refresh_token, new Date(tokenData._expirationDate))

    if (loadedAuthModel.token) {
      this.authModel.next(loadedAuthModel)
      this.username.next(loadedAuthModel.username)
      const expirationDuration = new Date(tokenData._expirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }

  }

  logout() {
    this.authModel.next(null);
    this.username.next(null)
    this.route.navigate(['/start']).then();
    localStorage.removeItem('tokenData')

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer)
    }
    this.expirationTimer = null;
  }

  autoLogout(expiration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expiration)
  }


  setIsLogged(newValue: boolean): void {
    this.isLogged.next(newValue);
  }

  getIsLogged(): Observable<boolean> {
    return this.isLogged.asObservable()
  }

  getRolesOfUser(username: string): Observable<ListResponseModel<RoleModel>> {
    return this.http.get<ListResponseModel<RoleModel>>(environment.apiUrl + `role/getallbyuser?username=${username}`)
  }

}
