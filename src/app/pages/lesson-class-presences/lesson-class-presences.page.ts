/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup } from '@ionic/angular';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IEbdClassLessonDetails, IEbdLabel } from 'src/app/interfaces';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-lesson-class-presences',
  templateUrl: './lesson-class-presences.page.html',
  styleUrls: ['./lesson-class-presences.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonClassPresencesPage implements OnInit, OnDestroy {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  hasLessonEnded = false;
  ebdPresencesRegister$: Observable<IPresenceRegister[]>;
  ebdLabels$: Observable<IEbdLabel[]>;
  classId: number = null;
  className = '';
  lessonId: number = null;
  lessonTitle = '';
  lessonDate: Date = null;
  visitorsQuantity = 0;
  moneyRaised = 0;
  oldMoneyRaised = 0;
  loggedUserIsTeacher = false;
  loggedUserHasFullAccess = false;
  limitedTimeToEdit: Date = null;

  private paramMapSubscription: Subscription;

  private detailsSubscription: Subscription;
  details$ = new Subject<number>();

  countdown = '';
  countdownActive = false;
  private countdownSubscription: Subscription;

  private handleHasLessonEndedSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private lessonService: LessonService,
    private router: Router,
    private utilService: UtilService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(
      (params) => {
        this.lessonId = Number(params.get('lessonId'));
        this.classId = Number(params.get('classId'));
        this.getEbdPresencesRegister(this.lessonId, this.classId);
        this.handleLoggedUserPermissions();
      }
    );
  }

  ngOnInit() {
    this.handleParams();
    this.subscribeDetails();
    this.getEbdLabels();
  }

  ngOnDestroy() {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }

    if (this.detailsSubscription) {
      this.detailsSubscription.unsubscribe();
    }

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    if (this.handleHasLessonEndedSubscription) {
      this.handleHasLessonEndedSubscription.unsubscribe();
    }
  }

  handleParams() {
    if (!this.router.getCurrentNavigation()?.extras?.state) {
      this.router.navigateByUrl('tabs/lessons', { replaceUrl: true });
      return;
    }

    const { lessonTitle, lessonDate, className, details } =
      this.router.getCurrentNavigation().extras.state;
    this.className = className;
    this.lessonTitle = lessonTitle;
    this.lessonDate = lessonDate;

    this.subscribeHandleHasLessonEnded();

    this.handleClassLessonDetails(details);
  }

  subscribeDetails() {
    this.detailsSubscription = this.details$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.saveEbdClassLessonDetails());
  }

  getEbdLabels() {
    this.ebdLabels$ = this.lessonService.getEbdLabels();
  }

  subscribeHandleHasLessonEnded() {
    this.handleHasLessonEnded();

    if (!this.hasLessonEnded) {
      const ONE_MINUTE = 1 * 60 * 1000;

      this.handleHasLessonEndedSubscription = interval(ONE_MINUTE).subscribe(
        () => {
          this.handleHasLessonEnded();
        }
      );
    }
  }

  startCountdown(editTime: number) {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    if (this.handleHasLessonEndedSubscription) {
      this.handleHasLessonEndedSubscription.unsubscribe();
    }

    const ONE_SECOND = 1000;

    this.countdownSubscription = interval(ONE_SECOND).subscribe(() => {
      const now = new Date().getTime();
      const diff = editTime - now;

      if (diff > 0) {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        this.countdown = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.changeDetectorRef.detectChanges();
      } else {
        this.countdownActive = false;
        this.countdown = '';
        this.handleHasLessonEnded();
        this.countdownSubscription.unsubscribe();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  checkCountdown() {
    const now = new Date().getTime();
    const diff = this.limitedTimeToEdit.getTime() - now;

    const TEN_MINUTES = 10 * 60 * 1000;

    if (diff > 0 && diff <= TEN_MINUTES) {
      this.countdownActive = true;
      this.startCountdown(this.limitedTimeToEdit.getTime());
    } else {
      this.countdownActive = false;
      this.countdown = '';
    }
  }

  handleHasLessonEnded() {
    const formattedLessonDate = new Date(
      this.utilService.datePipe.transform(
        this.lessonDate,
        `yyyy-MM-dd'T'HH:mm:ss.SSS`
      )
    );

    if (this.loggedUserHasFullAccess) {
      formattedLessonDate.setHours(9, 50, 0, 0);
      this.limitedTimeToEdit = formattedLessonDate;
    } else {
      formattedLessonDate.setHours(9, 15, 0, 0);
      this.limitedTimeToEdit = formattedLessonDate;
    }

    if (new Date() > formattedLessonDate) {
      this.hasLessonEnded = true;

      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }

      if (this.handleHasLessonEndedSubscription) {
        this.handleHasLessonEndedSubscription.unsubscribe();
      }

      return;
    }

    this.checkCountdown();
  }

  handleClassLessonDetails(details: IEbdClassLessonDetails | null) {
    if (details) {
      const { visitors_quantity: visitorsQuantity, money_raised: moneyRaised } =
        details;

      this.visitorsQuantity = visitorsQuantity || 0;
      this.moneyRaised = moneyRaised || 0;
      this.oldMoneyRaised = moneyRaised || 0;
      return;
    }

    this.lessonService
      .getEbdClassLessonDetails(this.lessonId, this.classId)
      .subscribe((ebdClassLessonDetails: any) => {
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
    this.ebdPresencesRegister$ = this.lessonService.getEbdPresencesRegister(
      lessonId,
      classId
    );
  }

  handleLoggedUserPermissions() {
    if (this.authService.$user?.getValue()) {
      const { classesAsATeacher, fullAccess } =
        this.authService.$user.getValue();
      this.loggedUserIsTeacher = !!classesAsATeacher?.find(
        ({ id }) => id === this.classId
      );
      this.loggedUserHasFullAccess = fullAccess;
    }
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
    this.lessonService
      .saveEbdClassLessonDetails(this.lessonId, this.classId, {
        visitors_quantity: this.visitorsQuantity,
        money_raised: null,
      })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async collapseAccordion() {
    this.accordionGroup.value = '';
  }

  async expandAccordion(value: string) {
    this.accordionGroup.value = value;
  }
}
