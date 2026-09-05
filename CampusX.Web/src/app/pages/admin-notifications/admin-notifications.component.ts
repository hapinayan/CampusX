import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-notifications.component.html',
  styleUrl: './admin-notifications.component.css'
})
export class AdminNotificationsComponent implements OnInit {

  notifications: any[] = [];

  studentId: number | null = null;
  title = '';
  notificationMessage = '';

  message = '';

  // DELETE POPUP
  showDeletePopup = false;
  selectedNotificationId: number | null = null;
  selectedNotificationTitle = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadNotifications();

  }


  // LOAD ALL NOTIFICATIONS
  loadNotifications() {

    this.http
      .get<any[]>(
        'https://localhost:7182/api/notifications'
      )
      .subscribe({

        next: (response) => {

          this.notifications = response;

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to load notifications';

          console.log(error);

        }

      });

  }


  // CREATE NOTIFICATION
  createNotification() {

    this.message = '';

    if (
      !this.title ||
      !this.notificationMessage
    ) {

      this.message =
        'Title and message are required';

      return;

    }

    const body = {

      studentId: this.studentId,
      title: this.title,
      message: this.notificationMessage

    };


    this.http
      .post<any>(
        'https://localhost:7182/api/notifications',
        body
      )
      .subscribe({

        next: (response) => {

          this.message =
            response.message;

          this.studentId = null;
          this.title = '';
          this.notificationMessage = '';

          this.loadNotifications();

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to create notification';

          console.log(error);

        }

      });

  }


  // OPEN DELETE POPUP
  openDeletePopup(
    notificationId: number,
    notificationTitle: string
  ) {

    this.selectedNotificationId =
      notificationId;

    this.selectedNotificationTitle =
      notificationTitle;

    this.showDeletePopup = true;

  }


  // CLOSE DELETE POPUP
  closeDeletePopup() {

    this.showDeletePopup = false;

    this.selectedNotificationId = null;

    this.selectedNotificationTitle = '';

  }


  // CONFIRM DELETE NOTIFICATION
  confirmDeleteNotification() {

    if (
      this.selectedNotificationId === null
    ) {
      return;
    }

    this.message = '';

    this.http
      .delete<any>(
        `https://localhost:7182/api/notifications/${this.selectedNotificationId}`
      )
      .subscribe({

        next: (response) => {

          this.message =
            response.message ||
            'Notification deleted successfully';

          this.closeDeletePopup();

          this.loadNotifications();

        },

        error: (error) => {

          this.message =
            error.error?.message ||
            'Failed to delete notification';

          console.log(error);

        }

      });

  }


  // BACK TO DASHBOARD
  goToDashboard() {

    this.router.navigate([
      '/admin-dashboard'
    ]);

  }

}