/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudent, IStudentHistory } from 'src/app/interfaces';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListComponent implements OnInit {
  filteredEbdStudents: IStudent[] = [];
  selectedStudent: IStudent | null = null;
  ebdStudentHistoryList$: Observable<IStudentHistory[] | null> = null;

  private _ebdStudents: IStudent[] = [];
  private _filteredName = null;
  private _orderById = 0;

  constructor(
    private studentService: StudentService,
  ) { }

  get ebdStudents(): IStudent[] {
    return this._ebdStudents;
  }

  @Input() set ebdStudents(ebdStudents: IStudent[]) {
    this._ebdStudents = ebdStudents;
    this.filteredEbdStudents = this.filteredEbdStudents?.length ? this.filteredEbdStudents : ebdStudents;
  }

  get filteredName(): string {
    return this._filteredName;
  }

  @Input() set filteredName(filteredName: string) {
    this._filteredName = filteredName;

    if (filteredName !== null && filteredName !== undefined) {
      this.filteredEbdStudents = this.ebdStudents.filter(
        student => student?.name?.toLowerCase()?.trim()?.includes(filteredName?.toLowerCase()?.trim())
      );

      this.sortPeople();
    }
  }

  get orderById(): number {
    return this._orderById;
  }

  @Input() set orderById(orderById: number) {
    this._orderById = orderById;

    this.sortPeople();
  }

  ngOnInit() {}

  onSelectPerson(student: IStudent | null) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if (student) {
      this.selectedStudent = student;
      this.getEbdPersonHistory(student.id);
    }
  }

  personTrackBy(index: number, person: IStudent) {
    return person?.id ?? index;
  }

  sortPeople(orderById = this.orderById) {
    if (!isNaN(orderById)) {
      // Ordem alfabética
      if (orderById === 0) {
        this.filteredEbdStudents.sort((student1, student2) => {
          if (student1.name.replace(/[^\x00-\x7F]/g,'') > student2.name.replace(/[^\x00-\x7F]/g,'')) {
            return 1;
          }

          if (student1.name.replace(/[^\x00-\x7F]/g,'') < student2.name.replace(/[^\x00-\x7F]/g,'')) {
            return -1;
          }

          return 0;
        });
        return;
      }

      // Frequentes
      if (orderById === 1) {
        this.filteredEbdStudents.sort((student1, student2) => {
          if (
            student1.frequency.presences_in_sequence > student2.frequency.presences_in_sequence
            ||
            student1.frequency.absences_in_sequence < student2.frequency.absences_in_sequence
          ) {
            return -1;
          }

          if (
            student1.frequency.presences_in_sequence < student2.frequency.presences_in_sequence
            ||
            student1.frequency.absences_in_sequence > student2.frequency.absences_in_sequence
          ) {
            return 1;
          }

          return 0;
        });
        return;
      }

      // Faltosos
      if (orderById === 2) {
        this.filteredEbdStudents.sort((student1, student2) => {
          if (!student1.ebd_class) {
            return 1;
          }

          if (
            student1.frequency.absences_in_sequence > student2.frequency.absences_in_sequence
            ||
            student1.frequency.presences_in_sequence < student2.frequency.presences_in_sequence
          ) {
            return -1;
          }

          if (
            student1.frequency.absences_in_sequence < student2.frequency.absences_in_sequence
            ||
            student1.frequency.presences_in_sequence > student2.frequency.presences_in_sequence
          ) {
            return 1;
          }

          return 0;
        });
        return;
      }
    }
  }

  getEbdPersonHistory(personId: number) {
    this.ebdStudentHistoryList$ = this.studentService.getEbdPersonHistory(personId);
  }

}
