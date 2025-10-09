import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { IStudent } from 'src/app/interfaces';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentComponent implements OnInit {
  @Input() student: IStudent;
  @Input() show = true;
  @Output() selectStudentEvent = new EventEmitter<IStudent>();

  constructor(
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly alertController: AlertController
  ) {}

  ngOnInit() {}

  handlePhoneNumber(whatsApp: string) {
    let formattedNumber = whatsApp.trim().replace(/\s|(-)|(\+)|\(|\)/g, '');

    if (formattedNumber.startsWith('819') && formattedNumber.length === 11) {
      formattedNumber = formattedNumber.replace('819', '');
    }

    if (formattedNumber.startsWith('81') && formattedNumber.length === 10) {
      formattedNumber = formattedNumber.replace('81', '');
    }

    return formattedNumber;
  }

  redirectToWhatsapp(whatsApp: string) {
    const formattedNumber = this.handlePhoneNumber(whatsApp);
    window.location.href = `https://wa.me/55819${formattedNumber}`;
  }

  redirectToCall(whatsApp: string) {
    const formattedNumber = this.handlePhoneNumber(whatsApp);
    window.location.href = `tel:819${formattedNumber}`;
  }

  async openStudentOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: `Tornar ${
            this.student.ebd_relation === 'visitante' ? 'Aluno' : 'Visitante'
          }`,
          data: { action: 'toggleRole' },
          handler: () => {
            this.toggleRelation();
          },
        },
        {
          text: 'Remover da Classe',
          role: 'destructive',
          data: { action: 'delete' },
          handler: () => {
            this.removeFromClass();
          },
        },
        {
          text: 'Voltar',
          role: 'cancel',
          data: { action: 'cancel' },
          handler: () => {
            console.log('Ação cancelada');
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async toggleRelation() {
    // await this.studentService.toggleRelation(this.student.id);

    this.student.ebd_relation =
      this.student.ebd_relation === 'visitante' ? 'aluno' : 'visitante';

    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: `${this.student.name} agora é um(a) ${this.student.ebd_relation}.`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async removeFromClass() {
    // await this.studentService.remove(this.student.id);

    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: `${this.student.name} foi removido(a) da classe.`,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
