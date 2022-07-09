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

}
