import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListResponseModel} from "../models/base_models/listResponseModel";
import {SolutionModel} from "../models/solutionModel";
import {environment} from "../../environments/environment";
import {SolutionAddModel} from "../models/solutionAddModel";
import {ResponseModel} from "../models/base_models/responseModel";
import {SingleResponseModel} from "../models/base_models/singleResponseModel";
import {SolutionUpdateModel} from "../models/solutionUpdateModel";

@Injectable({
  providedIn: 'root'
})
export class SolutionService {


  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ListResponseModel<SolutionModel>> {
    return this.http.get<ListResponseModel<SolutionModel>>(environment.apiUrl + `solutions/getallsolutiondetail`)
  }

  add(model: SolutionAddModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + `solutions/add`, model)
  }

  getAllByHomework(homeworkId: number): Observable<ListResponseModel<SolutionModel>> {
    return this.http.get<ListResponseModel<SolutionModel>>(environment.apiUrl + `solutions/getallsolutionbyhomework?homeworkId=${homeworkId}`)
  }

  delete(model: { id: number }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + "solutions/delete", model)
  }

  getUpdateModelById(solutionId: number): Observable<SingleResponseModel<SolutionUpdateModel>> {
    return this.http.get<SingleResponseModel<SolutionUpdateModel>>(environment.apiUrl + `solutions/getsolutionupdatedtobyid?solutionId=${solutionId}`)
  }
}
