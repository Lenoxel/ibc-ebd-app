import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Component({
  selector: 'app-lesson-class-presences',
  templateUrl: './lesson-class-presences.page.html',
  styleUrls: ['./lesson-class-presences.page.scss'],
})
export class LessonClassPresencesPage implements OnInit {
  ebdPresencesRegister$: Observable<any>;
  ebdLabels$: Observable<any>;
  classId: number = null;
  className = '';
  lessonId: number = null;
  lessonTitle = '';
  lessonDate: Date = null;

  constructor(
    private lessonService: LessonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.getEbdLabels();
    this.handleParams();
  }

  getEbdLabels() {
    this.ebdLabels$ = this.lessonService.getEbdLabels();
  }

  handleParams() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.lessonId = Number(params.get('lessonId'));
      this.classId = Number(params.get('classId'));
      this.getEbdPresencesRegister(this.lessonId, this.classId);
    });

    if (this.router.getCurrentNavigation()?.extras?.state) {
      const { lessonTitle, lessonDate, className } = this.router.getCurrentNavigation().extras.state;
      this.className = className;
      this.lessonTitle = lessonTitle;
      this.lessonDate = lessonDate;
    }
  }

  getEbdPresencesRegister(lessonId: number, classId: number) {
    this.ebdPresencesRegister$ = this.lessonService.getEbdPresencesRegister(lessonId, classId);
  }

  givePresence(presenceRegister: IPresenceRegister) {
    if (!presenceRegister.attended || !presenceRegister.register_on) {
      presenceRegister.underAction = true;

      presenceRegister.attended = true;
      presenceRegister.register_on = new Date();

      setTimeout(() => {
        presenceRegister.underAction = false;
      }, 350);
    }
  }

  async handleGiveAbsence(presenceRegister: IPresenceRegister) {
    const alert = await this.alertController.create({
      header: 'Justificar falta?',
      inputs: [
        {
          name: 'justification',
          type: 'text',
          placeholder: 'Digite aqui a justificativa'
        },
      ],
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            this.giveAbsence(presenceRegister);
          }
        }, {
          text: 'Sim',
          handler: ({ justification }) => {
            if (justification) {
              presenceRegister.justification = justification;
              this.giveAbsence(presenceRegister);
            } else {
              presenceRegister.justification = null;
              this.handleGiveAbsence(presenceRegister);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  giveAbsence(presenceRegister: IPresenceRegister) {
    if (presenceRegister.attended || !presenceRegister.register_on) {
      presenceRegister.underAction = true;

      presenceRegister.attended = false;
      presenceRegister.register_on = new Date();

      setTimeout(() => {
        presenceRegister.underAction = false;
      }, 300);
    }
  }

  giveCharacteristic(partialPresenceRegister: IPresenceRegister, title: string, isPositive: boolean = null) {
    if (isPositive !== null) {
      partialPresenceRegister.labels[title] = isPositive;
    } else {
      partialPresenceRegister.labels[title] = !partialPresenceRegister.labels[title] ?? true;
    }
  }
}
