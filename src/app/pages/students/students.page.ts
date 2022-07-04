import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudent, IStudentHistory } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EbdService } from 'src/app/services/ebd/ebd.service';
import { StudentService } from 'src/app/services/student/student.service';
import { EntityBasic, SearchbarOptions } from 'src/app/types';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage implements OnInit {
  loggedUserPreferredClass: EntityBasic | null = null;
  loggedUserHasFullAccess: boolean | null = false;
  ebdClasses$: Observable<EntityBasic[]>;
  ebdStudents$: Observable<IStudent[]>;
  filteredName = '';
  headerMarginTop = '0px';
  searchbarOptions: SearchbarOptions = {
    placeholder: 'Pesquise pelo aluno',
    showCancelButton: 'focus',
    debounce: 500
  };
  selectedStudent: IStudent | null;
  ebdStudentHistoryList$: Observable<IStudentHistory[] | null> = null;

  constructor(
    public authService: AuthService,
    private ebdService: EbdService,
    private studentService: StudentService,
  ) { }

  ngOnInit() {
    this.getEbdClasses();
    this.getLoggedUser();
  }

  onContentScroll(event) {
    this.headerMarginTop = `-${event?.detail?.scrollTop * 0.75}px`;
  }

  getLoggedUser() {
    const { classesAsASecretary, classesAsATeacher, fullAccess } = this.authService.$user.getValue();

    if (classesAsASecretary?.length) {
      this.loggedUserPreferredClass = classesAsASecretary[0];
      this.getEbdStudents(this.loggedUserPreferredClass?.id);
      return;
    }

    if (classesAsATeacher?.length) {
      this.loggedUserPreferredClass = classesAsATeacher[0];
      this.getEbdStudents(this.loggedUserPreferredClass?.id);
      return;
    }

    if (fullAccess) {
      this.loggedUserHasFullAccess = true;
      this.getEbdStudents();
      return;
    }
  }

  getEbdClasses() {
    this.ebdClasses$ = this.ebdService.getEbdClasses();
  }

  getEbdStudents(classId?: number) {
    this.ebdStudents$ = this.studentService.getEbdStudents(classId || this.loggedUserPreferredClass?.id);
  }

  getEbdStudentHistory(studentId: number) {
    this.ebdStudentHistoryList$ = this.studentService.getEbdStudentHistory(studentId);
  }

  onSelectClass(value: EntityBasic) {
    this.loggedUserPreferredClass = value;
    this.getEbdStudents();
  }

  onFilterStudents(value: string) {
    this.filteredName = value;
  }
}
