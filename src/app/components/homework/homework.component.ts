import {Component, OnInit} from '@angular/core';
import {faFileEdit, faShare, faTrash} from '@fortawesome/free-solid-svg-icons';
import {HomeworkService} from "../../services/homework.service";
import {SolutionModel} from "../../models/solutionModel";
import {SolutionService} from "../../services/solution.service";
import {NgForm} from "@angular/forms";
import {SolutionAddModel} from "../../models/solutionAddModel";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as Editor from "ckeditor5-33.0.0-5luuruis862l/build/ckeditor";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "../../services/auth.service";
import {CommentModel} from "../../models/commentModel";
import {CommentService} from "../../services/comment.service";
import {UserService} from "../../services/user.service";
import {UserModel} from "../../models/userModel";
import {CommentAddModel} from "../../models/commentAddModel";
import {ToastrService} from "ngx-toastr";
import {SolutionUpdateModel} from "../../models/solutionUpdateModel";
import {HomeworkModel} from "../../models/homeworkModel";

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit {

  solutions: SolutionModel[]
  solution: SolutionAddModel = {
    id: 0,
    homework: {id: 0},
    student: {id: 0},
    date: "",
    description: ""
  };
  solutionUpdateModel: SolutionUpdateModel;
  comments: CommentModel[]

  homework: HomeworkModel = {id: 0, title: "", description: "", date: "", type: 0, week: 0}

  user: UserModel;

  homeworkId: number;
  public studentUsername: string;

  public Editor = Editor;
  public solutionDesc: String = "";

  isLoading = false;

  faShare = faShare;
  faEdit = faFileEdit;
  faRemove = faTrash;

  answerModel = {solutionId: 0, isAnswer: false};


  constructor(public userService: UserService, public commentService: CommentService, public auth: AuthService, public sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private homeworkService: HomeworkService, private solutionService: SolutionService, private datePipe: DatePipe, public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.auth.username.subscribe({
      next: res => {
        this.studentUsername = res
        this.userService.get(this.studentUsername).subscribe({
          next: res => {
            this.user = res.data
          }
        })
      }
    })
    this.isLoading = true;
    this.route.params.subscribe({
      next: (params: Params) => {
        this.homeworkId = params['id']
        this.homeworkService.getById(this.homeworkId).subscribe({
          next: res => {
            this.homework = res.data

          }, error: err => {
            this.router.navigate(["/home/start"]).then()
          }
        })

        this.solutionService.getAllByHomework(this.homeworkId).subscribe({
          next: res => {
            this.solutions = res.data;
            this.commentService.getAllByHomework(this.homeworkId).subscribe({
              next: res => {
                this.isLoading = false;
                this.comments = res.data
              }
            })
          },
          error: err => {
            this.isLoading = false;
            this.router.navigate(["/home/start"]).then()
          }
        })
      }
    })
  }

  sendSolution(form: NgForm) {
    this.isLoadingSendBtn = true;
    if (!form.valid && form.value.solution <= 0) {
      this.toastr.warning("Lütfen Bir Çözüm Giriniz")
      this.isLoadingSendBtn = false;
      return;
    } else {
      if (this.solutionUpdateModel) {
        let model: SolutionAddModel = {
          id: this.solutionUpdateModel.id,
          date: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
          homework: {
            id: this.solutionUpdateModel.homeworkId
          },
          student: {
            id: this.solutionUpdateModel.studentId
          },
          description: form.value.solution

        }

        this.solutionService.add(model).subscribe({
          next: res => {
            this.toastr.success("Çözümün Güncellendi :)")
            this.solutionService.getAllByHomework(this.homeworkId).subscribe({
              next: res => {
                this.isLoadingSendBtn = false;
                this.solutions = res.data
                this.solutionUpdateModel = null;
                form.reset();
              }
            })
          }
        })
      } else {
        this.solution.date = this.datePipe.transform(new Date(), "yyyy-MM-dd")
        this.solution.description = form.value.solution
        this.solution.student = {id: this.user.id}
        this.solution.homework = {id: this.homeworkId}
        this.solutionService.add(this.solution).subscribe(a => {
          this.solutionService.getAllByHomework(this.homeworkId).subscribe({
            next: res => {
              this.isLoadingSendBtn = false;
              this.solutions = res.data
              form.reset()
            }
          })
        })
      }
    }


  }

  editSolution(solution: SolutionModel) {
    this.solutionService.getUpdateModelById(solution.id).subscribe({
      next: res => {
        this.solutionUpdateModel = res.data
        this.solutionDesc = solution.description
      }
    })
  }

  deleteSolution(solution: SolutionModel) {
    this.isLoadingDeleteBtn = true;
    this.solutionService.delete({id: solution.id}).subscribe({
      next: res => {
        this.toastr.success("Çözümün Silindi")
        this.solutionService.getAllByHomework(this.homeworkId).subscribe({
          next: res => {
            this.isLoadingDeleteBtn = false;
            this.solutions = res.data
          }
        })
      }
    })
  }

  openAnswerModel(solutionId: number, isAnswer: boolean) {
    this.answerModel.isAnswer = isAnswer;
    this.answerModel.solutionId = solutionId;
    setTimeout(() => {
      document.getElementById("commentForm").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }, 100)
  }

  closeAnswerModel() {
    this.answerModel.isAnswer = false;
    this.answerModel.solutionId = 0;
  }

  isValid = false;
  isLoadingSendBtn: boolean = false;
  isLoadingDeleteBtn = false;
  isLoadingSendComment = false;
  isLoadingDeleteComment = false;

  sendComment(commentForm: NgForm, solutionId: number) {
    this.isLoadingSendComment = true;
    if (!commentForm.valid) {
      this.toastr.warning("lütfen yorum alanını boş bırakmayın")
      this.isLoadingSendComment = false;
      return;
    }
    let commentAddModel: CommentAddModel = {
      text: commentForm.value.comment,
      homework: {
        id: this.homeworkId
      },
      solution: {
        id: solutionId
      },
      student: {
        id: this.user.id
      }
    }

    this.commentService.add(commentAddModel).subscribe({
      next: res => {
        this.commentService.getAllByHomework(this.homeworkId).subscribe({
          next: res => {
            this.comments = res.data
            this.isLoadingSendComment = false;
            commentForm.reset()
          }
        })
      }
    })

  }

  deleteComment(comment: CommentModel) {
    this.isLoadingDeleteComment = true;
    let solution = {id: comment.id}
    this.commentService.delete(solution).subscribe({
      next: res => {
        this.commentService.getAllByHomework(this.homeworkId).subscribe({
          next: res => {
            this.toastr.success("Yorumun silindi!")
            this.comments = res.data
            this.isLoadingDeleteComment = false;
          }
        })
      }
    })
  }
}
