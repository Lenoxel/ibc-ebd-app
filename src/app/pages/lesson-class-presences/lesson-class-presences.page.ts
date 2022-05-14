import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonAccordionGroup } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IEbdLabel } from 'src/app/interfaces';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-lesson-class-presences',
  templateUrl: './lesson-class-presences.page.html',
  styleUrls: ['./lesson-class-presences.page.scss'],
})
export class LessonClassPresencesPage implements OnInit {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  ebdPresencesRegister$: Observable<any>;
  ebdLabels$: Observable<any>;
  classId: number = null;
  className = '';
  lessonId: number = null;
  lessonTitle = '';
  lessonDate: Date = null;

  minVisitorsQuantity = 0;

  constructor(
    private lessonService: LessonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private utilService: UtilService,
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
    if (!presenceRegister.attended || !presenceRegister.tempRegisterOn) {
      presenceRegister.attended = true;
      presenceRegister.tempRegisterOn = new Date();
      presenceRegister.register_on = null;

      this.expandAccordion(`accordion-${presenceRegister?.id}`);
    }
  }

  giveAbsence(presenceRegister: IPresenceRegister) {
    if (presenceRegister.attended || !presenceRegister.tempRegisterOn) {

      presenceRegister.attended = false;
      presenceRegister.tempRegisterOn = new Date();
      presenceRegister.register_on = null;

      this.expandAccordion(`accordion-${presenceRegister?.id}`);
    }
  }

  giveCharacteristic(partialPresenceRegister: IPresenceRegister, label: IEbdLabel) {
    if (partialPresenceRegister.register_on) {
      partialPresenceRegister.tempRegisterOn = new Date(partialPresenceRegister.register_on);
      partialPresenceRegister.register_on = null;
    }

    let choosedLabel = partialPresenceRegister.labels.find(
      uniqueLabel => uniqueLabel.id ? uniqueLabel.id === label?.id : uniqueLabel.label_id === label?.id
    );

    if (choosedLabel) {
      choosedLabel = null;
      partialPresenceRegister.labels = partialPresenceRegister.labels.filter(
        uniqueLabel => uniqueLabel?.id !== label?.id && uniqueLabel?.label_id !== label?.label_id
      );
      partialPresenceRegister.labelIds = partialPresenceRegister.labelIds.filter(
        labelId => labelId !== label?.id && labelId !== label?.label_id
      );
      partialPresenceRegister.labels_to_remove.push(label);
    } else {
      partialPresenceRegister.labels.push(label);
      partialPresenceRegister.labelIds.push(label?.id);
      partialPresenceRegister.labels_to_remove = partialPresenceRegister.labels_to_remove.filter(
        uniqueLabel => uniqueLabel?.id !== label?.id
      );
    }
  }

  async handleSavePresenceRegister(presenceRegister: IPresenceRegister) {
    if (presenceRegister.attended) {
      this.handleGivePresence(presenceRegister);
    } else {
      this.handleGiveAbsence(presenceRegister);
    }
  }

  async handleGivePresence(presenceRegister: IPresenceRegister) {
    if (!presenceRegister?.tempRegisterOn && presenceRegister.register_on) {
      presenceRegister.tempRegisterOn = new Date(presenceRegister.register_on);
    }

    const hours = presenceRegister?.tempRegisterOn?.getHours();
    const minutes = presenceRegister?.tempRegisterOn?.getMinutes();

    const alert = await this.alertController.create({
      header: `Confirme o horário de chegada de ${presenceRegister?.student_name}`,
      inputs: [
        {
          name: 'arrivalTime',
          type: 'time',
          value: `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Salvar',
          handler: ({ arrivalTime }) => {
            if (arrivalTime) {
              const hoursAndMinutes = (arrivalTime as string)?.split(':');

              presenceRegister.tempRegisterOn.setHours(Number(hoursAndMinutes[0]), Number(hoursAndMinutes[1]));

              this.savePresenceRegister(presenceRegister);
            } else {
              this.handleGivePresence(presenceRegister);
            }
          }
        }
      ]
    });

    await alert.present();
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
            this.savePresenceRegister(presenceRegister);
          }
        }, {
          text: 'Sim',
          handler: ({ justification }) => {
            if (justification) {
              presenceRegister.justification = justification;
              this.savePresenceRegister(presenceRegister);
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


  async savePresenceRegister(presenceRegister: IPresenceRegister) {
    presenceRegister.underAction = true;
    presenceRegister.register_on = presenceRegister.tempRegisterOn;

    const presenceRegisterToUpdate: Partial<IPresenceRegister> = {
      attended: presenceRegister?.attended,
      justification: presenceRegister?.justification,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      register_on: presenceRegister?.register_on,
      labels: presenceRegister?.labels.map((label) => ({
        id: label?.id || label?.label_id,
        title: label?.title || label?.label_title,
        type: label?.type || label?.label_type,
      })),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      labels_to_remove: presenceRegister.labels_to_remove,
    };

    this.lessonService.saveUniqueEbdPresenceRegister(
      this.lessonId,
      this.classId,
      presenceRegister?.id,
      presenceRegisterToUpdate,
    ).subscribe((data) => {
      this.collapseAccordion();

      this.utilService.showToastController(
        `${presenceRegister.attended ? 'Presença' : 'Falta'} de ${presenceRegister.student_name} salva com sucesso!`,
        'primary',
        'top',
        2500,
        presenceRegister.attended ? 'checkmark-circle-outline' : 'close-circle-outline',
      );

      presenceRegister.underAction = false;
    }, err => {
      this.utilService.showToastController(
        `Ocorreu um erro ao dar ${presenceRegister.attended ? 'presença' : 'falta'} para ${presenceRegister.student_name}.`,
        'danger',
        'top',
        2500,
      );

      presenceRegister.underAction = false;
    });
  }

  async collapseAccordion() {
    this.accordionGroup.value = '';
  }

  async expandAccordion(value: string) {
    this.accordionGroup.value = value;
  }
}
