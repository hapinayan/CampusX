import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {

  fullName = '';

  constructor(private router: Router) {

    this.fullName =
      sessionStorage.getItem('fullName') || 'Student';
  }

  logout() {

    sessionStorage.clear();

    this.router.navigate(['/login']);
  }

  goToProfile() {
  this.router.navigate(['/student-profile']);
}
}