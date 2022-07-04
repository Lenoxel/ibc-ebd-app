import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudent, IStudentHistory } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StudentService } from 'src/app/services/student/student.service';
import { SearchbarOptions } from 'src/app/types';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {
  ebdStudents$: Observable<IStudent[]>;
  filteredName = '';
  headerMarginTop = '0px';
  searchbarOptions: SearchbarOptions = {
    placeholder: 'Pesquise pelo nome',
    showCancelButton: 'focus',
    debounce: 500
  };
  selectedStudent: IStudent | null;
  ebdStudentHistoryList$: Observable<IStudentHistory[] | null> = null;

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

  getEbdStudentHistory(studentId: number) {
    this.ebdStudentHistoryList$ = this.studentService.getEbdStudentHistory(studentId);
  }

  onFilterStudents(value: string) {
    this.filteredName = value;
  }

}
