import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {

  fullName = '';

  unreadCount = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {

    this.fullName =
      sessionStorage.getItem('fullName') || 'Student';
  }


  ngOnInit(): void {

    this.loadUnreadCount();

  }


  // LOAD UNREAD NOTIFICATION COUNT
  loadUnreadCount() {

    this.http
      .get<any>(
        'https://localhost:7182/api/notifications/unread-count'
      )
      .subscribe({

        next: (response) => {

          this.unreadCount =
            response.unreadCount;

          console.log(
            'Unread notifications:',
            this.unreadCount
          );

        },

        error: (error) => {

          console.log(
            'Failed to load unread notification count',
            error
          );

        }

      });

  }


  // LOGOUT
  logout() {

    sessionStorage.clear();

    this.router.navigate([
      '/login'
    ]);

  }


  // GO TO STUDENT PROFILE
  goToProfile() {

    this.router.navigate([
      '/student-profile'
    ]);

  }


  // GO TO NOTIFICATIONS
  goToNotifications() {

    this.router.navigate([
      '/student-notifications'
    ]);

  }

}