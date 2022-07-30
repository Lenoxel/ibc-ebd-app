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
    let formattedNumber = whatsApp.trim().replace(/\s/g, '');

    if (formattedNumber.startsWith('819') && formattedNumber.length === 11) {
      formattedNumber = formattedNumber.replace('819', '');
    }

    if (formattedNumber.startsWith('81') && formattedNumber.length === 10) {
      formattedNumber = formattedNumber.replace('81', '');
    }

    return `55819${formattedNumber}`;
  }

  redirectToWhatsapp(whatsApp: string) {
    const formattedNumber = this.handlePhoneNumber(whatsApp);
    window.location.href = `https://wa.me/${formattedNumber}`;
  }

  redirectToCall(whatsApp: string) {
    const formattedNumber = this.handlePhoneNumber(whatsApp);
    window.location.href = `tel:${formattedNumber}`;
  }

}
