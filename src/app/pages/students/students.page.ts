import { AfterContentInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IStudent, IStudentHistory } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EbdService } from 'src/app/services/ebd/ebd.service';
import { StudentService } from 'src/app/services/student/student.service';
import { EntityBasic, SearchbarOptions } from 'src/app/types';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsPage implements OnInit, AfterContentInit {
  loggedUserPreferredClass: EntityBasic | null = null;
  loggedUserHasFullAccess: boolean | null = false;
  ebdClasses$: Observable<EntityBasic[]>;
  ebdStudents$: Observable<IStudent[]>;
  filteredName = '';
  hideHeader$ = new Subject<boolean>();
  hideHeader = false;
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
  ) {
    this.hideHeader$.pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).subscribe((hideHeader: boolean) => this.hideHeader = hideHeader);
  }

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.getEbdClasses();
    this.getLoggedUser();
  }

  onContentScroll(event: CustomEvent) {
    this.hideHeader$.next(event?.detail?.deltaY > 0 ? true : false);
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

  getEbdPersonHistory(personId: number) {
    this.ebdStudentHistoryList$ = this.studentService.getEbdPersonHistory(personId);
  }

  onSelectClass(value: EntityBasic) {
    this.loggedUserPreferredClass = value;
    this.getEbdStudents();
  }

  onFilterStudents(value: string) {
    this.filteredName = value;
  }

  onSelectStudent(student: IStudent | null) {
    if (student) {
      this.selectedStudent = student;
      this.getEbdPersonHistory(student.id);
    }
  }
}
