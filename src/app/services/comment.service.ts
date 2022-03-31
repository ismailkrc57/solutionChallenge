import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListResponseModel} from "../models/base_models/listResponseModel";
import {CommentModel} from "../models/commentModel";
import {environment} from "../../environments/environment";
import {CommentAddModel} from "../models/commentAddModel";
import {ResponseModel} from "../models/base_models/responseModel";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getAllByHomework(homeworkId: number): Observable<ListResponseModel<CommentModel>> {
    return this.http.get<ListResponseModel<CommentModel>>(environment.apiUrl + `comments/getcommentdetaildtobyhomework?homeworkId=${homeworkId}`)
  }

  add(model: CommentAddModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + "comments/add", model)
  }

  delete(model: { id: number }): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(environment.apiUrl + "comments/delete", model)
  }
}
