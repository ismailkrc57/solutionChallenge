import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserDetailModel} from "../../models/userDetailModel";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NaviService} from "../../services/navi.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  edit: boolean;
  user: UserDetailModel = {id: 0, username: "", email: "", lastName: "", name: ""};
  userFullName: string = "";
  username: string = "";
  isLoading: boolean = false;

  constructor(private naviService: NaviService, private userService: UserService, private toastr: ToastrService, private auth: AuthService) {
  }

  ngOnDestroy(): void {
    this.naviService.setHomeworkIsVisible(true)
  }

  ngOnInit(): void {
    this.naviService.setHomeworkIsVisible(false);
    this.auth.username.subscribe({
      next: username => {
        this.username = username;
        this.userService.getByUsername(username).subscribe({
          next: res => {
            this.user = res.data
            this.userFullName = res.data.name + " " + res.data.lastName
          }
        })
      }
    })


  }

  changePassword(form: NgForm) {
    let passwordChangeModel = {username: "", lastPassword: "", newPassword: ""}
    let loginModel = {username: "", password: ""}
    if (!form.valid) {
      this.toastr.error("Lütfen Bilgilerinizi eksiksiz tamamlayın")
      return;
    }
    passwordChangeModel.username = this.user.username;
    passwordChangeModel.lastPassword = form.value.lastPassword;
    passwordChangeModel.newPassword = form.value.newPassword;


    this.userService.changePassword(passwordChangeModel.username, passwordChangeModel.lastPassword, passwordChangeModel.newPassword).subscribe({
      next: () => {
        loginModel.username = passwordChangeModel.username
        loginModel.password = passwordChangeModel.newPassword;
        this.toastr.success("Şifreniz Başarılı Bir Şekilde değiştirildi")
        form.reset();
        this.auth.login(loginModel).subscribe({
          next: () => {

          }
        })

      },
      error: () => {
        this.toastr.error("Lütfen girdiğin bilgileri kontrol et !!!")
      }
    })

  }


  save(pasForm: NgForm, registerForm: NgForm, password: string) {

    this.isLoading = true
    let username = registerForm.value.username;
    this.auth.login({username: this.username, password: password}).subscribe({
      next: () => {
        if (!registerForm.valid) {
          this.toastr.warning("Lütfen Tüm alanları eksiksiz doldurun")
          this.isLoading = false
          return;
        }
        this.userService.update(this.user).subscribe({
          next: () => {
            this.auth.login({username: username, password: password}).subscribe({
              next: () => {
                this.toastr.success("Bilgilerin başarıyla güncellendi")
                this.ngOnInit()
                pasForm.reset();
                this.isLoading = false;
                this.closeModal("closeModal2")
                this.edit = !this.edit
              }
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
                this.closeModal("closeModal2")
            }
          }
        })
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error("Şifre Hatalı")
      }
    })


  }

  cancel() {
    this.edit = !this.edit;
    this.auth.username.subscribe({
      next: username => {
        this.userService.getByUsername(username).subscribe({
          next: res => {
            this.user = res.data;
          }
        })
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
