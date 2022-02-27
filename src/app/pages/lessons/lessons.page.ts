import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
})
export class LessonsPage implements OnInit {
  ebdLessons$: Observable<any>;

  constructor(
    public authService: AuthService,
    private navController: NavController,
    private lessonService: LessonService,
  ) { }

  ngOnInit() {
    this.getEbdLessons();
  }

  getEbdLessons() {
    this.ebdLessons$ = this.lessonService.getEbdLessons();
  }

  async logout() {
    await this.authService.logout();
    this.navController.navigateRoot('login', { replaceUrl: true });
  }

}
