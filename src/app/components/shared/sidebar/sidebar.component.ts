import {Component, OnInit} from '@angular/core';
import {NaviService} from "../../../services/navi.service";
import {HomeworkService} from "../../../services/homework.service";
import {HomeworkModel} from "../../../models/homeworkModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = true;
  collapseMe: string = "";
  homeworks: HomeworkModel[]

  constructor(public navi: NaviService, private homeworkService: HomeworkService, private router: Router) {
    navi.getIsCollapsed().subscribe(a => {
      this.isCollapsed = a;
    })
  }

  ngOnInit(): void {
    this.homeworkService.getAll().subscribe({
      next: res => {
        this.homeworks = res.data;

      }
    })
  }

  collapse(id: number) {
    this.navi.setIsCollapsed(false);
    this.navi.getIsCollapsed().subscribe(a => {
        this.isCollapsed = a;
      }
    )
    this.router.navigate(['/home', id]).then(a => {
    })
  }
}
