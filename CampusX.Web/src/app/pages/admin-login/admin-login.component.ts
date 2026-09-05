import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  email = '';
  password = '';
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    this.message = '';

    if (!this.email || !this.password) {
      this.message = 'Please enter email and password';
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http
      .post<any>(
        'https://localhost:7182/api/admin-auth/login',
        loginData
      )
      .subscribe({
        next: (response) => {

          this.message = response.message;

          sessionStorage.setItem(
            'token',
            response.token
          );

          sessionStorage.setItem(
            'role',
            response.role
          );

          sessionStorage.setItem(
            'adminId',
            response.adminId.toString()
          );

          sessionStorage.setItem(
            'fullName',
            response.fullName
          );

          sessionStorage.setItem(
            'email',
            response.email
          );

          setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 800);
        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Admin login failed';
        }
      });
  }
}