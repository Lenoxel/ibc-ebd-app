import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IStudent } from 'src/app/interfaces';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentComponent implements OnInit {
  @Input() student: IStudent;
  @Input() show = true;
  @Output() selectStudentEvent = new EventEmitter<IStudent>();

  constructor() { }

  ngOnInit() {}

  handlePhoneNumber(whatsApp: string) {
    whatsApp = whatsApp.trim().replace(/\s/g, '');
    if (whatsApp.startsWith('819') && whatsApp.length === 11) {
      whatsApp = whatsApp.replace('819', '');
    }

    if (whatsApp.startsWith('81') && whatsApp.length === 10) {
      whatsApp = whatsApp.replace('81', '');
    }

    whatsApp = `55819${whatsApp}`;
  }

  redirectToWhatsapp(whatsApp: string) {
    this.handlePhoneNumber(whatsApp);

    window.location.href = `https://wa.me/${whatsApp}`;
  }

  redirectToCall(whatsApp: string) {
    this.handlePhoneNumber(whatsApp);

    window.location.href = `tel:${whatsApp}`;
  }

}
