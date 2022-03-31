import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SingleResponseModel} from "../models/base_models/singleResponseModel";
import {UserModel} from "../models/userModel";
import {environment} from "../../environments/environment";
import {UserDetailModel} from "../models/userDetailModel";
import {ResponseModel} from "../models/base_models/responseModel";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  get(username: string): Observable<SingleResponseModel<UserModel>> {
    return this.http.get<SingleResponseModel<UserModel>>(environment.apiUrl + `students/getstudentdetail?username=${username}`)
  }

  getByUsername(username: string): Observable<SingleResponseModel<UserDetailModel>> {
    return this.http.get<SingleResponseModel<UserDetailModel>>(environment.apiUrl + `students/getstudenteditdto?username=${username}`)
  }

  changePassword(username: string, password: string, newPassword: string): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(environment.apiUrl + `passwordreset?username=${username}&password=${password}&newPassword=${newPassword}`, {})
  }

  isTokenValid(token: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + `istokenvalid?token=${token}`, {})
  }

  sendEmailForResetPassword(email: String): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + `passwordresetbyemail?email=${email}`, {})
  }

  changePasswordWithToken(token: string, password: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + `passwordresetbytoken?token=${token}&password=${password}`, {})
  }

  update(model: UserDetailModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + "students/update", model);
  }
}
