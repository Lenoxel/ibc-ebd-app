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
  @Input() ebdStudents: IStudent[] = [];

  filteredEbdStudents: IStudent[] = [];
  selectedStudent: IStudent | null = null;
  ebdStudentHistoryList$: Observable<IStudentHistory[] | null> = null;

  private _filteredName = '';

  constructor(
    private studentService: StudentService,
  ) { }

  get filteredName(): string {
    return this._filteredName;
  }

  @Input() set filteredName(filteredName: string) {
    this._filteredName = filteredName;

    if (filteredName) {
      this.filteredEbdStudents = this.ebdStudents.filter(
        student => student?.name?.toLowerCase()?.trim()?.includes(filteredName?.toLowerCase()?.trim())
      );
    }
  }

  ngOnInit() {}

  onSelectPerson(student: IStudent | null) {
    if (student) {
      this.selectedStudent = student;
      this.getEbdPersonHistory(student.id);
    }
  }

  personTrackBy(index, person) {
    return person?.id ?? index;
  }

  getEbdPersonHistory(personId: number) {
    this.ebdStudentHistoryList$ = this.studentService.getEbdPersonHistory(personId);
  }

}
