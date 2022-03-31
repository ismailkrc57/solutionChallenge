import {Component, OnInit} from '@angular/core';
import {HomeworkModel} from "../../models/homeworkModel";
import {NgForm} from "@angular/forms";
import {HomeworkService} from "../../services/homework.service";
import {ToastrService} from "ngx-toastr";
import * as Editor from "ckeditor5-33.0.0-5luuruis862l/build/ckeditor";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading: false;
  homework: HomeworkModel = {id: 0, week: 0, type: 0, date: "", title: "", description: ""}
  Editor = Editor;

  constructor(private toast: ToastrService, private homeworkService: HomeworkService) {
  }

  ngOnInit(): void {
  }

  save(form: NgForm) {
    if (!form.valid) {
      this.toast.error("lutfen bilgileri kontrol et")
      return;
    }
    this.homework = Object.assign(form.value)
    let model: HomeworkModel = {
      id: 0,
      type: Number(this.homework.type),
      week: Number(this.homework.week),
      date: this.homework.date,
      title: this.homework.title,
      description: this.homework.description
    }
    console.log(model)
    this.homeworkService.add(model).subscribe({
      next: res => {
        this.toast.success(res.message)
      },
      error: err => {
        this.toast.error(err.error.message)
      }
    })

  }
}
