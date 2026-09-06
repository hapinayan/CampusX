import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent implements OnInit {

  student: any = null;

  message = '';

  isEditing = false;

  editData = {
    fullName: '',
    email: '',
    faculty: '',
    contactNumber: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {

    this.http
      .get<any>(
        'https://localhost:7182/api/students/profile'
      )
      .subscribe({
        next: (response) => {

          this.student = response;

          console.log('Profile loaded');
          console.log(response);
        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to load profile';

          console.log(error);
        }
      });
  }

  goToDashboard() {

    this.router.navigate([
      '/student-dashboard'
    ]);
  }

  startEdit() {

    this.message = '';

    this.editData = {
      fullName: this.student.fullName,
      email: this.student.email,
      faculty: this.student.faculty,
      contactNumber: this.student.contactNumber || ''
    };

    this.isEditing = true;
  }

  cancelEdit() {

    this.isEditing = false;
    this.message = '';
  }

  updateProfile() {

    this.message = '';

    if (
      !this.editData.fullName ||
      !this.editData.email ||
      !this.editData.faculty
    ) {
      this.message = 'Please fill all required fields';
      return;
    }

    this.http
      .put<any>(
        'https://localhost:7182/api/students/profile',
        this.editData
      )
      .subscribe({
        next: (response) => {

          this.message = response.message;

          this.isEditing = false;

          this.loadProfile();
        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to update profile';

          console.log(error);
        }
      });
  }
}