import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IEbdLabel } from 'src/app/interfaces';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-student-presence',
  templateUrl: './student-presence.component.html',
  styleUrls: ['./student-presence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPresenceComponent implements OnInit {
  @Input() presenceRegister: any;
  @Input() ebdLabels: any;
  @Input() hasLessonEnded = false;
  @Input() classId: number | null = null;
  @Input() lessonId: number | null = null;
  @Input() loggedUserIsTeacher = false;
  @Output() expandAccordionEvent = new EventEmitter<string>();
  @Output() collapseAccordionEvent = new EventEmitter<void>();

  constructor(
    private alertController: AlertController,
    private lessonService: LessonService,
    private utilService: UtilService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {}

  givePresence(presenceRegister: IPresenceRegister) {
    if (!presenceRegister.attended || !presenceRegister.tempRegisterOn) {
      presenceRegister.attended = true;
      presenceRegister.tempRegisterOn = new Date();
      presenceRegister.register_on = null;

      this.expandAccordionEvent.emit(`accordion-${presenceRegister?.id}`);
    }
  }

  giveAbsence(presenceRegister: IPresenceRegister) {
    if (presenceRegister.attended || !presenceRegister.tempRegisterOn) {

      presenceRegister.attended = false;
      presenceRegister.tempRegisterOn = new Date();
      presenceRegister.register_on = null;

      this.expandAccordionEvent.emit(`accordion-${presenceRegister?.id}`);
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
        uniqueLabel => uniqueLabel?.id ? uniqueLabel?.id !== label?.id : uniqueLabel?.label_id !== label?.label_id
      );

      partialPresenceRegister.labelIds = partialPresenceRegister.labelIds.filter(
        labelId => label?.id ? labelId !== label?.id : labelId !== label?.label_id
      );

      partialPresenceRegister.labels_to_remove.push(label);

      // if (!partialPresenceRegister.labels_to_remove.find(
      //   labelToRemove => labelToRemove?.id ? labelToRemove.id === label?.id : labelToRemove?.label_id === label?.id
      // )) {
      //   partialPresenceRegister.labels_to_remove.push(label);
      // }
    } else {
      partialPresenceRegister.labels.push(label);
      partialPresenceRegister.labelIds.push(label?.id);
      partialPresenceRegister.labels_to_remove = partialPresenceRegister.labels_to_remove.filter(
        uniqueLabel => uniqueLabel?.id ? uniqueLabel?.id !== label?.id : uniqueLabel?.label_id !== label?.id
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
    presenceRegister.tempRegisterOn = presenceRegister.register_on ? new Date(presenceRegister.register_on) : new Date();
    presenceRegister.register_on = null;

    const hours = presenceRegister?.tempRegisterOn?.getHours();
    const minutes = presenceRegister?.tempRegisterOn?.getMinutes();

    const alert = await this.alertController.create({
      header: `Confirme o horário de chegada de ${presenceRegister?.person_name}`,
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

              presenceRegister.tempRegisterOn = new Date(
                presenceRegister.tempRegisterOn.getFullYear(),
                presenceRegister.tempRegisterOn.getMonth(),
                presenceRegister.tempRegisterOn.getDate(),
                Number(hoursAndMinutes[0]),
                Number(hoursAndMinutes[1]),
              );

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
      this.collapseAccordionEvent.emit();

      this.utilService.showToastController(
        `${presenceRegister.attended ? 'Presença' : 'Falta'} de ${presenceRegister.person_name} salva com sucesso!`,
        'primary',
        'top',
        3500,
        presenceRegister.attended ? 'checkmark-circle-outline' : 'close-circle-outline',
      );

      presenceRegister.underAction = false;
    }, err => {
      this.utilService.showToastController(
        `Ocorreu um erro ao dar ${presenceRegister.attended ? 'presença' : 'falta'} para ${presenceRegister.person_name}.`,
        'danger',
        'top',
        3500,
      );

      presenceRegister.underAction = false;
    });
  }
}
