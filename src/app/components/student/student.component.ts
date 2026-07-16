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
import { EbdService } from 'src/app/services/ebd/ebd.service';

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
    private readonly alertController: AlertController,
    private readonly ebdService: EbdService,
  ) {}

  ngOnInit() {
    console.log('StudentComponent initialized with student:', this.student);
  }

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
    let buttons = [
      {
        text: `Tornar ${
          this.student.ebd_relation === 'visitante' ? 'Aluno' : 'Visitante'
        }`,
        data: { action: 'toggleRole' },
        handler: () => {
          this.confirmToggleRelation();
        },
      },
      {
        text: 'Remover da Classe',
        role: 'destructive',
        data: { action: 'delete' },
        handler: () => {
          this.confirmRemoveFromClass();
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
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      buttons,
    });

    await actionSheet.present();
  }

  async isStudentInClass() {
    if (!this.student.ebd_class) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: `${this.student.name} não está em nenhuma classe.`,
        buttons: ['OK'],
      });

      await alert.present();

      return false;
    }

    return true;
  }

  async confirmToggleRelation() {
    const isStudentInClass = await this.isStudentInClass();

    if (!isStudentInClass) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: `Tem certeza que deseja tornar ${this.student.name} um(a) ${
        this.student.ebd_relation === 'visitante' ? 'Aluno' : 'Visitante'
      }?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.toggleRelation();
          },
        },
      ],
    });

    await alert.present();
  }

  async toggleRelation() {
    const isStudentInClass = await this.isStudentInClass();

    if (!isStudentInClass) {
      return;
    }

    const newRelation =
      this.student.ebd_relation === 'visitante' ? 'aluno' : 'visitante';

    this.ebdService
      .toggleMemberRelation(
        this.student.ebd_class.id,
        this.student.id,
        newRelation,
      )
      .subscribe(
        async () => {
          this.student.ebd_relation =
            this.student.ebd_relation === 'visitante' ? 'aluno' : 'visitante';

          const alert = await this.alertController.create({
            header: 'Sucesso',
            message: `${this.student.name} agora é um(a) ${this.student.ebd_relation}.`,
            buttons: ['OK'],
          });

          await alert.present();
        },
        async () => {
          const alert = await this.alertController.create({
            header: 'Erro',
            message: `Ocorreu um erro ao tentar alterar a relação de ${this.student.name}.`,
            buttons: ['OK'],
          });

          await alert.present();
        },
      );
  }

  async confirmRemoveFromClass() {
    const isStudentInClass = await this.isStudentInClass();

    if (!isStudentInClass) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: `Tem certeza que deseja remover ${this.student.name} da classe ${this.student.ebd_class.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.removeFromClass();
          },
        },
      ],
    });

    await alert.present();
  }

  async removeFromClass() {
    const isStudentInClass = await this.isStudentInClass();

    if (!isStudentInClass) {
      return;
    }

    this.ebdService
      .removeMemberFromClass(this.student.ebd_class.id, this.student.id)
      .subscribe(
        async () => {
          const className = this.student.ebd_class.name;

          this.student.ebd_class = null;

          const alert = await this.alertController.create({
            header: 'Sucesso',
            message: `${this.student.name} foi removido(a) da classe ${className}.`,
            buttons: ['OK'],
          });

          await alert.present();
          this.student.ebd_class = null;
        },
        async () => {
          const alert = await this.alertController.create({
            header: 'Erro',
            message: `Ocorreu um erro ao tentar remover ${this.student.name} da classe ${this.student.ebd_class.name}.`,
            buttons: ['OK'],
          });

          await alert.present();
        },
      );
  }
}
