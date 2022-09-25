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
import {RoleModel} from "../models/role-model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged: BehaviorSubject<boolean>;
  authModel = new BehaviorSubject<AuthModel>(null)
  roleModel: RoleModel[]
  public username: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private expirationTimer: any;

  private jwtHelper: JwtHelperService = new JwtHelperService()
  public Admin: BehaviorSubject<boolean> = new BehaviorSubject(null);

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
      this.isAdmin(authModel.username).subscribe({
        next: res => {
          localStorage.setItem("xfc", "true")
        },
        error: err => {
          localStorage.removeItem("xfc")
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
      this.isAdmin(loadedAuthModel.username).subscribe({
        next: res => {
          localStorage.setItem("xfc", "true")
        },
        error: err => {
          localStorage.removeItem("xfc")
        }
      })
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

  isAdmin(username: string = this.username.value): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(environment.apiUrl + `role/isadmin?username=${username}`)
  }

}
