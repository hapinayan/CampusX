import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './student-notifications.component.html',
  styleUrl: './student-notifications.component.css'
})
export class StudentNotificationsComponent implements OnInit {

  notifications: any[] = [];

  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {

    this.message = '';

    this.http
      .get<any[]>(
        'https://localhost:7182/api/notifications/my'
      )
      .subscribe({

        next: (response) => {

          this.notifications = response;

          console.log('Notifications loaded');
          console.log(response);

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to load notifications';

          console.log(error);

        }

      });
  }

  markAsRead(notificationId: number) {

    this.http
      .put<any>(
        `https://localhost:7182/api/notifications/${notificationId}/read`,
        {}
      )
      .subscribe({

        next: () => {

          this.loadNotifications();

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to mark notification as read';

          console.log(error);

        }

      });
  }

  goToDashboard() {

    this.router.navigate([
      '/student-dashboard'
    ]);

  }

}