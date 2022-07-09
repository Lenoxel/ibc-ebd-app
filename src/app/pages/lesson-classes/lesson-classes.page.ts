import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IEbdClass } from 'src/app/interfaces';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Component({
  selector: 'app-lesson-classes',
  templateUrl: './lesson-classes.page.html',
  styleUrls: ['./lesson-classes.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonClassesPage implements OnInit {
  ebdClasses$: Observable<any>;
  lessonId: number = null;
  lessonTitle = '';
  lessonDate: Date = null;

  constructor(
    private lessonService: LessonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.lessonId = Number(params.get('lessonId'));
      this.getEbdClassesByLesson(this.lessonId);
    });

    if (this.router.getCurrentNavigation()?.extras?.state) {
      const { lessonTitle, lessonDate } = this.router.getCurrentNavigation().extras.state;
      this.lessonTitle = lessonTitle;
      this.lessonDate = lessonDate;
    }
  }

  getEbdClassesByLesson(lessonId: number) {
    this.ebdClasses$ = this.lessonService.getEbdClassesByLesson(lessonId);
  }

  handleClassCick({ class_id: classId, class_name: className, details }: IEbdClass) {
    this.router.navigateByUrl(
      `lesson/${this.lessonId}/classes/${classId}/presences`,
      { state: {
        className,
        lessonTitle: this.lessonTitle,
        lessonDate: this.lessonDate,
        details,
      } }
    );
  }

}
