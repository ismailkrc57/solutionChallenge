import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {NaviService} from "../../../services/navi.service";
import {Subscription} from "rxjs";
import {UserService} from "../../../services/user.service";
import {UserModel} from "../../../models/userModel";
import {faHome, faHomeLg, faListCheck} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit, OnDestroy {
  isLogged: boolean = false;
  private userSub: Subscription
  isCollapsed: boolean = false;
  user: UserModel = {
    name: "?",
    lastName: "?",
    id: 0
  };
  faListCheck = faListCheck;
  homeworkIsVisible: boolean = true;
  faHome = faHome;

  constructor(public auth: AuthService, public navi: NaviService, private userService: UserService) {
    this.navi.getIsCollapsed().subscribe(a => {
      this.isCollapsed = a;
    })
  }

  ngOnInit(): void {
    this.navi.getHomeworkIsVisible().subscribe({
      next: res => {
        this.homeworkIsVisible = res;
      }
    })
    this.userSub = this.auth.authModel.subscribe(authModel => {
      this.isLogged = !!authModel;
      if (authModel) {
        this.userService.get(authModel.username).subscribe({
          next: res => {
            this.user = res.data
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  logout() {
    this.auth.logout();
  }

  collapse() {
    this.navi.setIsCollapsed(!this.isCollapsed)
  }
}
