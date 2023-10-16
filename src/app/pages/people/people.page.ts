import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IStudent } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EbdService } from 'src/app/services/ebd/ebd.service';
import { StudentService } from 'src/app/services/student/student.service';
import { EntityBasic, SearchbarOptions, SelectOptions } from 'src/app/types';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeoplePage implements OnInit, AfterContentInit {
  loggedUserPreferredClass: EntityBasic | null = null;
  loggedUserHasFullAccess: boolean | null = false;
  ebdClasses$: Observable<EntityBasic[]>;
  ebdStudents$: Observable<IStudent[]>;
  filteredName = '';
  hideHeader$ = new Subject<boolean>();
  hideHeader = false;
  orderById = 0;

  orderByOptionsItems: EntityBasic[] = [
    {
      id: 0,
      name: 'Ordem alfabética',
    },
    {
      id: 1,
      name: 'Frequentes',
    },
    {
      id: 2,
      name: 'Faltosos',
    },
  ];
  orderBy = this.orderByOptionsItems.find((option) => option.id === 0);
  orderByOptions: SelectOptions<EntityBasic> = {
    placeholder: 'Ordernar por',
    items: this.orderByOptionsItems,
    chosenItem: this.orderBy,
  };

  searchbarOptions: SearchbarOptions = {
    placeholder: 'Pesquise pelo nome',
    showCancelButton: 'focus',
    debounce: 500,
  };

  constructor(
    public authService: AuthService,
    private ebdService: EbdService,
    private studentService: StudentService
  ) {
    this.hideHeader$
      .pipe(debounceTime(50), distinctUntilChanged())
      .subscribe((hideHeader: boolean) => (this.hideHeader = hideHeader));
  }

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.getEbdClasses();
    this.getLoggedUser();
  }

  getLoggedUser() {
    const { classesAsASecretary, classesAsATeacher, fullAccess } =
      this.authService.$user.getValue();

    if (fullAccess) {
      this.loggedUserHasFullAccess = true;
      this.getEbdStudents();
      return;
    }

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
  }

  getEbdClasses() {
    this.ebdClasses$ = this.ebdService.getEbdClasses();
  }

  getEbdStudents(classId?: number) {
    this.ebdStudents$ = this.studentService.getEbdStudents(
      classId || this.loggedUserPreferredClass?.id
    );
  }

  onSelectClass(value: EntityBasic) {
    this.loggedUserPreferredClass = value;
    this.getEbdStudents();
  }

  onChangeOrderBy({ id }: EntityBasic) {
    this.orderById = id;
  }

  onFilterStudents(value: string) {
    this.filteredName = value;
    // const tempEbdStudents = this.ebdStudents$;
    // this.ebdStudents$ = null;
    // setTimeout(() => {
    //   this.ebdStudents$ = tempEbdStudents;
    // }, 100);
  }
}
