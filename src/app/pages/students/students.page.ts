import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StudentService } from 'src/app/services/student/student.service';
import { SearchbarOptions } from 'src/app/types';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {
  ebdStudents$: Observable<any>;
  headerMarginTop = '0px';
  selectedStudent: any = null;
  searchbarOptions: SearchbarOptions = {
    placeholder: 'Pesquise por um aluno',
    showCancelButton: 'focus',
    debounce: 500
  };

  constructor(
    public authService: AuthService,
    private studentService: StudentService,
  ) { }

  ngOnInit() {
    this.getEbdStudents();
  }

  onContentScroll(event) {
    this.headerMarginTop = `-${event?.detail?.scrollTop * 0.75}px`;
  }

  getEbdStudents() {
    this.ebdStudents$ = this.studentService.getEbdStudents();
  }

}
