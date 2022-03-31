import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {HomeComponent} from "./components/home/home.component";
import {HomeworkComponent} from "./components/homework/homework.component";
import {UserDetailComponent} from "./components/user-detail/user-detail.component";
import {AuthGuard} from "./guards/auth.guard";
import {AuthComponent} from "./components/auth/auth.component";
import {StartComponent} from "./components/start/start.component";
import {HStartComponent} from "./components/start/h-start/h-start.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {NotFoundComponent} from "./components/shared/not-found/not-found.component";

const routes: Routes = [

  {path: 'reset-password/:token', component: ResetPasswordComponent, pathMatch: "full"},
  {path: '', redirectTo: 'home/start', pathMatch: 'full'},
  {
    path: 'user-detail', component: UserDetailComponent, canActivate: [AuthGuard]
  },
  {
    path: 'auth', component: AuthComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: "", redirectTo: 'login', pathMatch: 'full'}
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      {path: 'start', component: HStartComponent, pathMatch: 'full'},
      {path: ':id', component: HomeworkComponent},

    ]
  },
  {path: 'start', component: StartComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
