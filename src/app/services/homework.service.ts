import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListResponseModel} from "../models/base_models/listResponseModel";
import {HomeworkModel} from "../models/homeworkModel";
import {environment} from "../../environments/environment";
import {SingleResponseModel} from "../models/base_models/singleResponseModel";

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  constructor(private http: HttpClient) {
  }

  getAll():Observable<ListResponseModel<HomeworkModel>>{
    return this.http.get<ListResponseModel<HomeworkModel>>(environment.apiUrl + `homeworks/getall`);
  }
  getById(id:number):Observable<SingleResponseModel<HomeworkModel>>{
    return this.http.get<SingleResponseModel<HomeworkModel>>(environment.apiUrl+`homeworks/getbyid?id=${id}`)
  }


}
