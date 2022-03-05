import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Component({
  selector: 'app-lesson-classes',
  templateUrl: './lesson-classes.page.html',
  styleUrls: ['./lesson-classes.page.scss'],
})
export class LessonClassesPage implements OnInit {
  ebdClasses$: Observable<any>;
  lessonId: number = null;

  constructor(
    private lessonService: LessonService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.lessonId = Number(params.get('lessonId'));
      this.getEbdClassesByLesson(this.lessonId);
   });
  }

  getEbdClassesByLesson(lessonId: number) {
    this.ebdClasses$ = this.lessonService.getEbdClassesByLesson(lessonId);
  }

}
