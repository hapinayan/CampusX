import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  indexNumber = '';
  fullName = '';
  email = '';
  faculty = '';
  contactNumber = '';
  password = '';
  confirmPassword = '';

  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register() {

    this.message = '';

    if (
      !this.indexNumber ||
      !this.fullName ||
      !this.email ||
      !this.faculty ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.message = 'Please fill all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    const studentData = {
      indexNumber: this.indexNumber,
      fullName: this.fullName,
      email: this.email,
      faculty: this.faculty,
      contactNumber: this.contactNumber,
      password: this.password
    };

    this.http
      .post<any>(
        'https://localhost:7182/api/students/register',
        studentData
      )
      .subscribe({
        next: (response) => {

          this.message = response.message;

          this.indexNumber = '';
          this.fullName = '';
          this.email = '';
          this.faculty = '';
          this.contactNumber = '';
          this.password = '';
          this.confirmPassword = '';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1200);
        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Registration failed';
        }
      });
  }
}