import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {exhaustMap, take} from 'rxjs/operators'
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    return this.authService.authModel.pipe(take(1),
      exhaustMap(authModel => {
        if (!authModel) {
          return next.handle(request);
        }
        let newRequest: HttpRequest<any>;
        newRequest = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + authModel.token)
        });
        return next.handle(newRequest)
      }))
  }
}
