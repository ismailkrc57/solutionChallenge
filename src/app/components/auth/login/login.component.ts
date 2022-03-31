import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {LoginModel} from "../../../models/auth_models/loginModel";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginModel: LoginModel;
  isLoading = false;

  emailIsLoading = false;


  constructor(private userService: UserService, public auth: AuthService, public route: Router, private toast: ToastrService) {
  }


  ngOnInit(): void {
  }

  login(form: NgForm) {
    if (!form.valid) {
      this.toast.warning("lütfen")
      return;
    }

    this.isLoading = true;
    this.auth.setIsLogged(true);
    this.loginModel = Object.assign(form.value)

    this.auth.login(this.loginModel).subscribe({
      next: () => {
        this.route.navigate(['/home/start']).then(() => {
          this.toast.success("Giriş Başarılı")
        });
        this.isLoading = false;
      },
      error: (res) => {
        this.isLoading = false;
        if (res.error.data.message === "invalid credentials")
          this.toast.error("Lütfen Bilgilerini Kontrol Et ")
        else this.toast.error("Opps!! Bilinmeyen bir Hata Oldu ")
      }
    })
  }

  resetPassword(form: NgForm) {

    if (!form.valid) {
      this.toast.warning("lütfen doğru formatta bir email girin")
      return;
    }
    this.emailIsLoading = true;
    this.userService.sendEmailForResetPassword(form.value.email).subscribe({
      next: () => {
        this.emailIsLoading = false;
        this.toast.success("Lütfen mailiniz kontrol edin")
        form.reset();
        this.closeModal("closeModal")
      },
      error: () => {
        this.emailIsLoading = false;
        this.toast.success("Lütfen mailiniz kontrol edin")
        form.reset();
        this.closeModal("closeModal")
      },
      complete: () => {

      }
    })

  }

  closeModal(id: string) {
    let elem = document.getElementById(id);

    let evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    elem.dispatchEvent(evt);
  }
}
