import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';

import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AdminStudentDetailComponent } from './pages/admin-student-detail/admin-student-detail.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

import { StudentNotificationsComponent } from './pages/student-notifications/student-notifications.component';
import { AdminNotificationsComponent } from './pages/admin-notifications/admin-notifications.component';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'admin-login',
    component: AdminLoginComponent
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'admin-students',
    component: AdminStudentsComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'admin-students/:id',
    component: AdminStudentDetailComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'student-profile',
    component: StudentProfileComponent,
    canActivate: [authGuard]
  },

  {
  path: 'student-notifications',
  component: StudentNotificationsComponent,
  canActivate: [authGuard]
},

{
  path: 'admin-notifications',
  component: AdminNotificationsComponent,
  canActivate: [adminGuard]
}

];