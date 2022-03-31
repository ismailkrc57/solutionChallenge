import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NaviService} from "../../services/navi.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  isValid: boolean = true;
  isLoading = false;
  token: string = "";
  isLoadingBtn: boolean = false;

  constructor(private router: Router, private toastr: ToastrService, private naviService: NaviService, private activatedRoute: ActivatedRoute, private userService: UserService) {
  }

  ngOnDestroy(): void {
    this.naviService.setIsVisible(true);
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.naviService.setIsVisible(false)
    this.activatedRoute.params.subscribe({
      next: params => {
        this.token = params['token'];
        this.userService.isTokenValid(this.token).subscribe({
          next: res => {
            this.isLoading = false;
            this.isValid = true;
          },
          error: err => {
            this.isLoading = false
            this.isValid = false
          }
        })
      }
    })

  }


  save(f: NgForm) {

    this.isLoadingBtn = true;
    if (!f.valid) {
      this.toastr.warning("Lutfen girdiğiniz bilgileri kontrol edin")
      this.isLoadingBtn = false;
      return;
    }
    this.userService.changePasswordWithToken(this.token, f.value.password).subscribe({
      next: res => {
        this.toastr.success("Şifreniz başarılı bir şekilde değiştirldi")
        this.router.navigate(['']).then()

      },
      error: err => {
        this.toastr.error("bilinmeyen bir hata oldu")
        this.isLoadingBtn = false;
      }
    })


  }
}
