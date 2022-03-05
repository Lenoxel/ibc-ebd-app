import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
})
export class LessonsPage implements OnInit, AfterViewInit {
  ebdLessons$: Observable<any>;

  constructor(
    public authService: AuthService,
    private navController: NavController,
    private lessonService: LessonService,
    private utilService: UtilService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getEbdLessons();
  }

  ngAfterViewInit() {
  }

  getEbdLessons() {
    this.ebdLessons$ = this.lessonService.getEbdLessons();
  }

  handleLessonClick(lessonId: number) {
    if (this.authService.$user.getValue()?.classes?.length) {
      const userEbdClass = this.authService.$user.getValue().classes.find(ebdClass => ebdClass?.id === lessonId);
      if (userEbdClass) {
        this.router.navigateByUrl(`lesson/${lessonId}/classes/${userEbdClass?.id}/presences`);
      }
    } else {
      this.router.navigateByUrl(`lesson/${lessonId}/classes`);
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

  async logout() {
    await this.authService.logout();
    this.navController.navigateRoot('login', { replaceUrl: true });
  }

}
