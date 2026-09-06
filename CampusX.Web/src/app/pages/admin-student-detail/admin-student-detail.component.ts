import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-student-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin-student-detail.component.html',
  styleUrl: './admin-student-detail.component.css'
})
export class AdminStudentDetailComponent implements OnInit {

  student: any = null;
  message = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadStudent(id);
    } else {
      this.message = 'Student ID not found';
    }

  }

  loadStudent(id: string) {

    this.http
      .get<any>(
        `https://localhost:7182/api/students/${id}`
      )
      .subscribe({
        next: (response) => {
          this.student = response;
        },
        error: (error) => {
          this.message =
            error.error?.message ||
            'Failed to load student details';

          console.log(error);
        }
      });

  }

  goBack() {
    this.router.navigate(['/admin-students']);
  }

}