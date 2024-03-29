import { AfterContentInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ILesson } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonsPage implements OnInit, AfterContentInit {
  ebdLessons$: Observable<any>;
  hideHeader$ = new Subject<boolean>();
  hideHeader = false;

  constructor(
    public authService: AuthService,
    private lessonService: LessonService,
    private utilService: UtilService,
    private router: Router,
  ) {
    this.hideHeader$.pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).subscribe((hideHeader: boolean) => this.hideHeader = hideHeader);
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.getEbdLessons();
  }

  getEbdLessons() {
    this.ebdLessons$ = this.lessonService.getEbdLessons();
  }

  handleLessonClick({ id: lessonId, title, date }: ILesson) {
    const { classesAsASecretary, classesAsATeacher } = this.authService.$user.getValue();

    if (classesAsASecretary?.length) {
      const userEbdClass = classesAsASecretary[0];
      this.router.navigateByUrl(
        `lesson/${lessonId}/classes/${userEbdClass?.id}/presences`,
        { state: { lessonTitle: title, lessonDate: date, className: userEbdClass?.name } }
      );
      return;
    }

    if (classesAsATeacher?.length) {
      const userEbdClass = classesAsATeacher[0];
      this.router.navigateByUrl(
        `lesson/${lessonId}/classes/${userEbdClass?.id}/presences`,
        { state: { lessonTitle: title, lessonDate: date, className: userEbdClass?.name} }
      );
      return;
    }

    this.router.navigateByUrl(
      `lesson/${lessonId}/classes`,
      { state: { lessonTitle: title, lessonDate: date } }
    );
  }

  showPresenceRecordsInfo(type: 'presents' | 'absents' | 'pending', quantity: number) {
    const lookUpTable = {
      presents: (count: number) => {
        this.utilService.showToastController(
          `${count || 'Nenhum'} ${count > 1 ? 'alunos presentes' : 'aluno presente' } nessa lição.`,
          'success',
          'top'
        );
      },
      absents: (count: number) => {
        this.utilService.showToastController(
          `${count || 'Nenhum'} ${count > 1 ? 'alunos faltaram' : 'aluno faltou' } a essa lição.`,
          'danger',
          'top'
        );
      },
      pending: (count: number) => {
        this.utilService.showToastController(
          // eslint-disable-next-line max-len
          `${count || 'Nenhum'} ${count > 1 ? 'alunos com chamada pendente' : 'aluno com chamada pendente'} nessa lição.`,
          'dark',
          'top'
        );
      },
    };

    return lookUpTable[type](quantity);
  }

  showLessonNotAcessibleYet(lessonDate: string) {
    this.utilService.showToastController(
      `Essa lição ainda não está acessível, pois irá acontecer em ${this.utilService.datePipe.transform(lessonDate, 'dd/MM/yyyy')}`,
      'light',
      'top'
    );
  }

  showLessonIsSingleClass() {
    this.utilService.showToastController(
      `Essa lição é do tipo classe única e não possui chamada`,
      'light',
      'top'
    );
  }

}
