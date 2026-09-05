import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  fullName = '';

  totalStudents = 0;
  activeStudents = 0;
  inactiveStudents = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.fullName =
      sessionStorage.getItem('fullName') || 'Administrator';
  }

  ngOnInit(): void {
    this.loadStudentCounts();
  }

  loadStudentCounts() {

    this.http
      .get<any[]>(
        'https://localhost:7182/api/students'
      )
      .subscribe({
        next: (students) => {

          this.totalStudents = students.length;

          this.activeStudents =
            students.filter(
              student => student.isActive
            ).length;

          this.inactiveStudents =
            students.filter(
              student => !student.isActive
            ).length;

          console.log('Dashboard student counts loaded');
        },

        error: (error) => {
          console.log(
            'Failed to load dashboard counts',
            error
          );
        }
      });
  }

  goToStudents() {
    this.router.navigate(['/admin-students']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/admin-login']);
  }

}