import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {
  headerMarginTop = '0px';
  selectedStudent: any = null;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  getStudents() {}

}
