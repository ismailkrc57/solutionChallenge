import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  passwordConfirmArr: {
    password: "";
    confirm: ""
  };
  isLoading: boolean = false;


  constructor(private authService: AuthService, private toastr: ToastrService, public router: Router) {

  }

  ngOnInit(): void {
  }

  register(form: NgForm) {
    this.isLoading = true;

    if (!form.valid && (form.value.password.value === form.value.pasConfirm.value)) {
      this.toastr.warning("lütfen tüm alanları eksiksiz doldurun")
      return;
    }
    this.authService.register(form.value).subscribe({
      next: res => {
        this.isLoading = false;
        this.toastr.success("Kayıt Başarılı ;) Lütfen Giriş Yapın")
        form.reset()
        this.router.navigate(["/auth/login"]).then(res => {

        })
      },
      error: err => {
        this.isLoading = false;
        switch (err.error.message) {
          case 'USERNAME_IN_USE':
            this.toastr.error("Kullancı adı başkası tarafından kullanılıyor")
            break
          case 'EMAIL_IN_USE':
            this.toastr.error("Email başkası tarafından kullanılıyor")
            break
          default :
            this.toastr.error("Bilinmeyen bir hata oldu")
        }
      }
    })

  }
}
