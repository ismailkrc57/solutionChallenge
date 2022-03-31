import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from './components/auth/register/register.component';
import {LoginComponent} from './components/auth/login/login.component';
import {NaviComponent} from './components/shared/navi/navi.component';
import {FooterComponent} from './components/shared/footer/footer.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {HomeComponent} from './components/home/home.component';
import {HomeworkComponent} from './components/homework/homework.component';
import {SidebarComponent} from './components/shared/sidebar/sidebar.component';
import {StartComponent} from './components/start/start.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';
import {CollapseDirective} from './directive/collapse.directive';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SpinnerComponent} from './components/shared/spinner/spinner.component';
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {ToastrModule} from "ngx-toastr";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {AuthComponent} from './components/auth/auth.component';
import {AvatarModule} from "ngx-avatar";
import {DatePipe} from "@angular/common";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SolutionComponent } from './components/solution/solution.component';
import { CommentComponent } from './components/comment/comment.component';
import { HStartComponent } from './components/start/h-start/h-start.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SpinnerCircComponent } from './components/shared/spinner-circ/spinner-circ.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NaviComponent,
    FooterComponent,
    HomeComponent,
    HomeworkComponent,
    SidebarComponent,
    StartComponent,
    UserDetailComponent,
    CollapseDirective,
    CollapseDirective,
    SpinnerComponent,
    AuthComponent,
    SolutionComponent,
    CommentComponent,
    HStartComponent,
    ResetPasswordComponent,
    SpinnerCircComponent,
    NotFoundComponent,
    DashboardComponent,


  ],
  imports: [
    CKEditorModule,
    FormsModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    FontAwesomeModule,
    ToastrModule.forRoot({
      positionClass: "toast-top-center",
      disableTimeOut: false,
      timeOut: 2500,
      closeButton: true,
      easing: "eas-out"
    }),
    AvatarModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
  ],
  providers: [DatePipe, {provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
