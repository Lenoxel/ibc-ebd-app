/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IEbdClassLessonDetails } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-lesson-class-presences',
  templateUrl: './lesson-class-presences.page.html',
  styleUrls: ['./lesson-class-presences.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonClassPresencesPage implements OnInit {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  hasLessonEnded = false;
  ebdPresencesRegister$: Observable<any>;
  ebdLabels$: Observable<any>;
  classId: number = null;
  className = '';
  lessonId: number = null;
  lessonTitle = '';
  lessonDate: Date = null;
  visitorsQuantity = 0;
  moneyRaised = 0;
  oldMoneyRaised = 0;
  loggedUserIsTeacher = false;
  details$ = new Subject<number>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private lessonService: LessonService,
    private router: Router,
    private utilService: UtilService,
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.lessonId = Number(params.get('lessonId'));
      this.classId = Number(params.get('classId'));
      this.getEbdPresencesRegister(this.lessonId, this.classId);
      this.handleLoggedUserIsTeacher();
    });
  }

  ngOnInit() {
    this.handleParams();
    this.subscribeDetails();
    this.getEbdLabels();
  }

  handleParams() {
    if (!this.router.getCurrentNavigation()?.extras?.state) {
      this.router.navigateByUrl('tabs/lessons', { replaceUrl: true });
      return;
    }

    const {
      lessonTitle,
      lessonDate,
      className,
      details,
    } = this.router.getCurrentNavigation().extras.state;
    this.className = className;
    this.lessonTitle = lessonTitle;
    this.lessonDate = lessonDate;

    this.handleHasLessonEnded();
    this.handleClassLessonDetails(details);
  }

  subscribeDetails() {
    this.details$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(() => this.saveEbdClassLessonDetails());
  }

  getEbdLabels() {
    this.ebdLabels$ = this.lessonService.getEbdLabels();
  }

  handleHasLessonEnded() {
    const formattedLessonDate = new Date(this.utilService.datePipe.transform(this.lessonDate, `yyyy-MM-dd'T'HH:mm:ss.SSS`));
    formattedLessonDate.setHours(16, 0, 0, 0);

    if (new Date() > formattedLessonDate) {
      this.hasLessonEnded = true;
    }
  }

  handleClassLessonDetails(details: IEbdClassLessonDetails | null) {
    if (details) {
      const {
        visitors_quantity: visitorsQuantity,
        money_raised: moneyRaised,
      } = details;

      this.visitorsQuantity = visitorsQuantity || 0;
      this.moneyRaised = moneyRaised || 0;
      this.oldMoneyRaised = moneyRaised || 0;
      return;
    }

    this.lessonService.getEbdClassLessonDetails(this.lessonId, this.classId).subscribe((ebdClassLessonDetails: any) => {
      const {
        visitors_quantity: visitorsQuantity,
        money_raised: moneyRaised,
      } = ebdClassLessonDetails;

      this.visitorsQuantity = visitorsQuantity || 0;
      this.moneyRaised = moneyRaised || 0;
      this.oldMoneyRaised = moneyRaised || 0;
      return;
    });
  }

  getEbdPresencesRegister(lessonId: number, classId: number) {
    this.ebdPresencesRegister$ = this.lessonService.getEbdPresencesRegister(lessonId, classId);
  }

  handleLoggedUserIsTeacher() {
    const { classesAsATeacher } = this.authService.$user.getValue();
    this.loggedUserIsTeacher = !!(classesAsATeacher?.find(({ id }) => id === this.classId));
  }

  increaseVisitorsQuantity() {
    this.visitorsQuantity += 1;
    this.details$.next();
  }

  decreaseVisitorsQuantity() {
    this.visitorsQuantity -= 1;
    this.details$.next();
  }

  moneyRaisedCheck(): boolean {
    const result = /^\d+\.?\d{0,2}$/.test(String(this.moneyRaised));
    if (!result) {
      this.moneyRaised = this.oldMoneyRaised;
    } else {
      this.oldMoneyRaised = this.moneyRaised;
    }
    return result;
  }

  saveEbdClassLessonDetails() {
    this.lessonService.saveEbdClassLessonDetails(
      this.lessonId,
      this.classId,
      {
        visitors_quantity: this.visitorsQuantity,
        money_raised: null,
      }
    ).subscribe((data) => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  async collapseAccordion() {
    this.accordionGroup.value = '';
  }

  async expandAccordion(value: string) {
    this.accordionGroup.value = value;
  }
}
