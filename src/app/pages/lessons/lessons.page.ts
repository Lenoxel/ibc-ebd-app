import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ViewDidEnter } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ILesson } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
})
export class LessonsPage implements OnInit, ViewDidEnter {
  ebdLessons$: Observable<any>;
  headerMarginTop = '0px';

  constructor(
    public authService: AuthService,
    private navController: NavController,
    private lessonService: LessonService,
    private utilService: UtilService,
    private router: Router,
  ) {}

  ionViewDidEnter(): void {
  }

  ngOnInit() {
    this.getEbdLessons();
  }

  onContentScroll(event) {
    this.headerMarginTop = `-${event?.detail?.scrollTop * 0.75}px`;
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
    } else if (classesAsATeacher?.length) {
      const userEbdClass = classesAsATeacher[0];
      this.router.navigateByUrl(
        `lesson/${lessonId}/classes/${userEbdClass?.id}/presences`,
        { state: { lessonTitle: title, lessonDate: date, className: userEbdClass?.name} }
      );
    } else {
      this.router.navigateByUrl(
        `lesson/${lessonId}/classes`,
        { state: { lessonTitle: title, lessonDate: date } }
      );
    }
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

  showLessonNotAcessibleYet() {
    this.utilService.showToastController(
      `Essa lição não está acessível pois ainda não aconteceu.`,
      'light',
      'top'
    );
  }

  async logout() {
    await this.authService.logout();
    this.navController.navigateRoot('login', { replaceUrl: true });
  }

}
