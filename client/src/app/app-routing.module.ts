import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskEditComponent } from './components/tasks/task-edit/task-edit.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskStartComponent } from './components/task-start/task-start.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'tasks', component: TasksComponent, canActivate: [AuthGuard], children: [
      { path: '', component: TaskStartComponent },
      { path: 'list', component: TaskListComponent },
      { path: 'new', component: TaskEditComponent },
      { path: ':id', component: TaskEditComponent },
      { path: ':id/edit', component: TaskEditComponent }
 ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
