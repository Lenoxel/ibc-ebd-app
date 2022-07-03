/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IStudent } from 'src/app/interfaces';

@Component({
  selector: 'app-student-history',
  templateUrl: './student-history.component.html',
  styleUrls: ['./student-history.component.scss'],
})
export class StudentHistoryComponent implements OnInit {
  @ViewChild(IonModal, { static: false }) modal: IonModal;
  @Output() dismissModalEvent = new EventEmitter<void>();

  private _student: IStudent | null;

  constructor() { }

  get student(): IStudent | null {
    return this._student;
  }

  @Input() set student(student: IStudent | null) {
    if (!student) {
      return;
    }

    this._student = student;
    this.showModal();
  }

  ngOnInit() {}

  showModal() {
    this.modal.present();
  }

  hideModal() {
    this.modal.dismiss();
  }
}
