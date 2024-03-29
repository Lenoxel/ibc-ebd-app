/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable no-underscore-dangle */
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { IStudent, IStudentHistory } from 'src/app/interfaces';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-student-history-modal',
  templateUrl: './student-history-modal.component.html',
  styleUrls: ['./student-history-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentHistoryModalComponent implements OnInit, OnDestroy {
  @ViewChild(IonModal, { static: false }) modal: IonModal;
  @Output() dismissModalEvent = new EventEmitter<void>();

  loading = true;
  presencesCount = 0;
  absencesCount = 0;
  startDate: Date | null = null;
  endDate: Date | null = null;

  private _student: IStudent | null = null;
  private _studentHistoryList: IStudentHistory[] | null = null;

  constructor(
    public utilService: UtilService,
    private location: Location,
    private platform: Platform,
  ) {
    // const now = new Date();
    // this.startDate = new Date(now.getTime() - (1000 * 3600 * 24 * 90));
    // this.endDate = new Date();
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.hideModal();
    });

    this.location.onUrlChange(url => {
      if (url === '/tabs/people') {
        this.hideModal();
      }
    });
  }

  get student(): IStudent | null {
    return this._student;
  }

  get studentHistoryList(): IStudentHistory[] | null {
    return this._studentHistoryList;
  }

  @Input() set student(student: IStudent | null) {
    if (!student) {
      this.location.go(`tabs/people`);
      return;
    }

    this._student = student;
    this.location.go(`tabs/people/${student?.id}`);
    this.showModal();
  }

  @Input() set studentHistoryList(studentHistoryList: IStudentHistory[] | null) {
    this.loading = true;
    this._studentHistoryList = studentHistoryList;

    if (studentHistoryList?.length) {
      this.presencesCount = studentHistoryList.filter(studentHistory => studentHistory?.attended)?.length;
      this.absencesCount = studentHistoryList.filter(studentHistory => !studentHistory?.attended)?.length;
      this.loading = false;
    } else {
      this.presencesCount = 0;
      this.absencesCount = 0;
      this.loading = false;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.hideModal();
  }

  showModal() {
    this.modal.present();
  }

  hideModal() {
    this.modal?.dismiss();
  }
}
