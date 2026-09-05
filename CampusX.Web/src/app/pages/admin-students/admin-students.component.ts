import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-students.component.html',
  styleUrl: './admin-students.component.css'
})
export class AdminStudentsComponent implements OnInit {

  students: any[] = [];

  search = '';
  faculty = '';

  message = '';

  showDeletePopup = false;
  selectedStudentId: number | null = null;
  selectedStudentName = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }


  loadStudents() {

    this.message = '';

    let url = 'https://localhost:7182/api/students';

    const params: string[] = [];

    if (this.search) {
      params.push(
        `search=${encodeURIComponent(this.search)}`
      );
    }

    if (this.faculty) {
      params.push(
        `faculty=${encodeURIComponent(this.faculty)}`
      );
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    this.http
      .get<any[]>(url)
      .subscribe({

        next: (response) => {

          this.students = response;

          console.log('Students loaded');
          console.log(response);

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to load students';

          console.log(error);

        }

      });
  }


  // SEARCH
  searchStudents() {
    this.loadStudents();
  }


  // BACK TO ADMIN DASHBOARD
  goToDashboard() {

    this.router.navigate([
      '/admin-dashboard'
    ]);

  }


  // VIEW STUDENT
  viewStudent(studentId: number) {

    this.router.navigate([
      '/admin-students',
      studentId
    ]);

  }


  // DEACTIVATE STUDENT
  deactivateStudent(studentId: number) {

    this.message = '';

    this.http
      .put<any>(
        `https://localhost:7182/api/students/${studentId}/deactivate`,
        {}
      )
      .subscribe({

        next: (response) => {

          this.message = response.message;

          this.loadStudents();

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to deactivate student';

          console.log(error);

        }

      });
  }


  // ACTIVATE STUDENT
  activateStudent(studentId: number) {

    this.message = '';

    this.http
      .put<any>(
        `https://localhost:7182/api/students/${studentId}/activate`,
        {}
      )
      .subscribe({

        next: (response) => {

          this.message = response.message;

          this.loadStudents();

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to activate student';

          console.log(error);

        }

      });
  }


  // OPEN DELETE POPUP
  openDeletePopup(
    studentId: number,
    studentName: string
  ) {

    this.selectedStudentId = studentId;

    this.selectedStudentName = studentName;

    this.showDeletePopup = true;

  }


  // CLOSE DELETE POPUP
  closeDeletePopup() {

    this.showDeletePopup = false;

    this.selectedStudentId = null;

    this.selectedStudentName = '';

  }


  // CONFIRM DELETE STUDENT
  confirmDeleteStudent() {

    if (this.selectedStudentId === null) {
      return;
    }

    this.message = '';

    this.http
      .delete<any>(
        `https://localhost:7182/api/students/${this.selectedStudentId}`
      )
      .subscribe({

        next: (response) => {

          this.message =
            response.message ||
            'Student deleted successfully';

          this.closeDeletePopup();

          this.loadStudents();

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to delete student';

          console.log(error);

        }

      });
  }

}