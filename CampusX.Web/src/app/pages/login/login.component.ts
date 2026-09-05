import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

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
        'https://localhost:7182/api/auth/login',
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
            'studentId',
            response.studentId.toString()
          );

          sessionStorage.setItem(
            'fullName',
            response.fullName
          );

          sessionStorage.setItem(
            'email',
            response.email
          );

          console.log('Login successful');
          console.log(response);

          setTimeout(() => {
            this.router.navigate(['/student-dashboard']);
          }, 800);
        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Login failed';

          console.log(error);
        }
      });
  }
}