import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {NaviService} from "./services/navi.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'solutionChallenge';
  navi: boolean = false;

  constructor(private authService: AuthService, private naviService: NaviService) {
  }

  ngOnInit(): void {
    this.authService.autoLogin()
    this.naviService.isVisible.subscribe({
      next: isVisible => {
        this.navi = isVisible
      }
    })
  }

  ngOnDestroy(): void {

  }
}
