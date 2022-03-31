import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private route: Router, private toast: ToastrService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.roleModel.pipe(map(role => {
      let isAdmin = false;
      role.map(role => role.name === "admin" ? isAdmin = false : "")
      return isAdmin;
    }), tap(role => {
      if (!role) {
        this.route.navigate(['start']).then(() => {
          this.toast.info("Lütfen Giriş Yapın")
        })
      }
    }))
  }
}
